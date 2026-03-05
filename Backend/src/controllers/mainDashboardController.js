const { pool } = require('../config/db');

const getMainDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Leads Statistics
        const [leadsStats] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN tag = 'Not Contacted' OR created_at >= DATE_SUB(NOW(), INTERVAL 2 DAY) THEN 1 ELSE 0 END) as new,
                SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread,
                SUM(CASE WHEN tag = 'Lost' THEN 1 ELSE 0 END) as dropped,
                SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) as trending,
                SUM(CASE WHEN tag = 'Closed' THEN 1 ELSE 0 END) as converted
            FROM leads WHERE user_id = ?
        `, [userId]);

        const totalLeads = leadsStats[0].total || 0;
        const convertedLeads = leadsStats[0].converted || 0;
        const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

        // 2. Pipeline Statistics
        const [pipelineStats] = await pool.query(`
            SELECT 
                SUM(value) as totalValue,
                COUNT(CASE WHEN status = 'Active' THEN 1 END) as activeDeals,
                COUNT(CASE WHEN tag = 'Closed' THEN 1 END) as wonDeals,
                COUNT(CASE WHEN tag = 'Lost' THEN 1 END) as lostDeals,
                AVG(value) as avgDealSize
            FROM leads WHERE user_id = ?
        `, [userId]);

        // 3. Clients Statistics
        const [clientsStats] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive,
                SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 ELSE 0 END) as newThisMonth
            FROM clients WHERE user_id = ?
        `, [userId]);

        // 4. Employees Statistics
        const [employeesStats] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'resigned' THEN 1 ELSE 0 END) as resigned
            FROM employees WHERE user_id = ?
        `, [userId]);

        // Today's attendance
        const [attendanceStats] = await pool.query(`
            SELECT 
                COUNT(DISTINCT employee_id) as present,
                SUM(CASE WHEN status = 'on_leave' THEN 1 ELSE 0 END) as onLeave
            FROM attendance 
            WHERE user_id = ? AND DATE(date) = CURDATE()
        `, [userId]);

        // 5. Channel Performance (Lead Sources)
        const [channelStats] = await pool.query(`
            SELECT 
                lead_source,
                COUNT(*) as count
            FROM leads 
            WHERE user_id = ? AND lead_source IS NOT NULL AND lead_source != ''
            GROUP BY lead_source
        `, [userId]);

        const channels = {
            meta: 0,
            justdial: 0,
            indiamart: 0,
            googleDocs: 0,
            crmForm: 0
        };

        channelStats.forEach(ch => {
            const source = ch.lead_source.toLowerCase();
            if (source.includes('meta') || source.includes('facebook')) channels.meta = Number(ch.count);
            else if (source.includes('justdial')) channels.justdial = Number(ch.count);
            else if (source.includes('indiamart')) channels.indiamart = Number(ch.count);
            else if (source.includes('google')) channels.googleDocs = Number(ch.count);
            else channels.crmForm += Number(ch.count);
        });

        // 6. Activities Statistics
        const [quotationsCount] = await pool.query('SELECT COUNT(*) as count FROM quotations WHERE user_id = ?', [userId]);
        const [invoicesCount] = await pool.query('SELECT COUNT(*) as count FROM invoices WHERE user_id = ?', [userId]);
        const [expensesSum] = await pool.query('SELECT SUM(amount) as total FROM expenses WHERE user_id = ?', [userId]);
        const [todosCount] = await pool.query('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND completed = 0', [userId]);
        const [notesCount] = await pool.query('SELECT COUNT(*) as count FROM notes WHERE user_id = ?', [userId]);

        // 7. Recent Leads (last 5)
        const [recentLeads] = await pool.query(`
            SELECT 
                id,
                name,
                organization_name as company,
                lead_source as source,
                tag as status,
                value,
                DATE_FORMAT(created_at, '%Y-%m-%d') as date
            FROM leads 
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 5
        `, [userId]);

        // 8. Pipeline Stages
        const [pipelineStages] = await pool.query(`
            SELECT 
                s.name,
                COUNT(l.id) as count,
                SUM(COALESCE(l.value, 0)) as value
            FROM pipeline_stages s
            INNER JOIN pipelines p ON s.pipeline_id = p.id
            LEFT JOIN leads l ON s.id = l.stage_id AND l.user_id = ?
            WHERE p.user_id = ?
            GROUP BY s.id, s.name
            ORDER BY s.stage_order
            LIMIT 5
        `, [userId, userId]);

        // 9. Top Performers (Employees with most closed deals)
        const [topPerformers] = await pool.query(`
            SELECT 
                e.employee_name as name,
                COUNT(l.id) as leads,
                SUM(CASE WHEN l.tag = 'Closed' THEN 1 ELSE 0 END) as deals,
                SUM(CASE WHEN l.tag = 'Closed' THEN COALESCE(l.value, 0) ELSE 0 END) as revenue
            FROM employees e
            LEFT JOIN leads l ON e.id = l.assigned_to AND l.user_id = ?
            WHERE e.user_id = ?
            GROUP BY e.id
            ORDER BY revenue DESC
            LIMIT 4
        `, [userId, userId]);

        // 10. Upcoming Birthdays
        const [upcomingBirthdays] = await pool.query(`
            SELECT 
                employee_name as name,
                DATE_FORMAT(date_of_birth, '%d %b') as date,
                department_id as department,
                profile_picture as avatar
            FROM employees
            WHERE user_id = ? 
            AND MONTH(date_of_birth) = MONTH(CURDATE())
            AND DAY(date_of_birth) >= DAY(CURDATE())
            ORDER BY DAY(date_of_birth)
            LIMIT 4
        `, [userId]);

        // 11. Revenue Goal Progress
        const [goalRows] = await pool.query(`
            SELECT target_value as target, goal_title as label
            FROM goals 
            WHERE user_id = ? AND goal_type = 'revenue' 
            AND CURDATE() BETWEEN start_date AND end_date
            LIMIT 1
        `, [userId]);

        const [revenueRes] = await pool.query(`
            SELECT SUM(total_amount) as current 
            FROM invoices WHERE user_id = ? AND status = 'Paid'
            AND invoice_date BETWEEN DATE_FORMAT(NOW() ,'%Y-01-01') AND NOW()
        `, [userId]);

        const revenueGoal = {
            current: Number(revenueRes[0].current || 0),
            target: Number(goalRows[0]?.target || 10000000),
            label: goalRows[0]?.label || "Annual Revenue Goal"
        };

        // 12. Recent Documents (Invoices + Quotations)
        const [docRows] = await pool.query(`
            (SELECT id, 'Invoice' as type, client_name as client, total_amount as amount, 
             DATE_FORMAT(invoice_date, '%Y-%m-%d') as date, status
             FROM invoices WHERE user_id = ? ORDER BY invoice_date DESC LIMIT 3)
            UNION ALL
            (SELECT id, 'Quotation' as type, client_name as client, total_amount as amount,
             DATE_FORMAT(quotation_date, '%Y-%m-%d') as date, status
             FROM quotations WHERE user_id = ? ORDER BY quotation_date DESC LIMIT 3)
            ORDER BY date DESC LIMIT 5
        `, [userId, userId]);

        // 13. Today's Focus (Priority Tasks)
        const [focusTasks] = await pool.query(`
            SELECT id, title, DATE_FORMAT(due_time, '%h:%i %p') as time, 
            (priority = 'High') as urgent
            FROM tasks 
            WHERE user_id = ? AND due_date = CURDATE() AND completed = 0
            ORDER BY due_time ASC LIMIT 3
        `, [userId]);

        // 14. Revenue Trend (Last 6 Months)
        const [revenueTrend] = await pool.query(`
            SELECT 
                DATE_FORMAT(invoice_date, '%b') as month,
                SUM(total_amount) as revenue
            FROM invoices 
            WHERE user_id = ? AND status = 'Paid'
            AND invoice_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY month, MONTH(invoice_date)
            ORDER BY MONTH(invoice_date) ASC
        `, [userId]);

        // 15. Growth Calculations (Comparing this month vs last month)
        const [prevMonthStats] = await pool.query(`
            SELECT 
                COUNT(*) as leadCount,
                SUM(value) as pipelineValue,
                (SELECT COUNT(*) FROM clients WHERE user_id = ? AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)) as clientCount
            FROM leads 
            WHERE user_id = ? AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)
        `, [userId, userId]);

        const calculateGrowth = (current, previous) => {
            if (!previous || previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        const growth = {
            leads: calculateGrowth(totalLeads, prevMonthStats[0].leadCount),
            pipeline: calculateGrowth(pipelineStats[0].totalValue || 0, prevMonthStats[0].pipelineValue || 0),
            clients: calculateGrowth(clientsStats[0].total || 0, prevMonthStats[0].clientCount || 0)
        };

        res.json({
            success: true,
            stats: {
                leads: {
                    total: Number(totalLeads),
                    new: Number(leadsStats[0].new || 0),
                    unread: Number(leadsStats[0].unread || 0),
                    dropped: Number(leadsStats[0].dropped || 0),
                    trending: Number(leadsStats[0].trending || 0),
                    conversionRate: parseFloat(conversionRate),
                    growth: growth.leads
                },
                pipeline: {
                    totalValue: Number(pipelineStats[0].totalValue || 0),
                    activeDeals: Number(pipelineStats[0].activeDeals || 0),
                    wonDeals: Number(pipelineStats[0].wonDeals || 0),
                    lostDeals: Number(pipelineStats[0].lostDeals || 0),
                    avgDealSize: parseFloat(pipelineStats[0].avgDealSize || 0),
                    growth: growth.pipeline
                },
                clients: {
                    total: Number(clientsStats[0].total || 0),
                    active: Number(clientsStats[0].active || 0),
                    inactive: Number(clientsStats[0].inactive || 0),
                    newThisMonth: Number(clientsStats[0].newThisMonth || 0),
                    growth: growth.clients
                },
                employees: {
                    total: Number(employeesStats[0].total || 0),
                    active: Number(employeesStats[0].active || 0),
                    resigned: Number(employeesStats[0].resigned || 0),
                    onLeave: Number(attendanceStats[0]?.onLeave || 0),
                    present: Number(attendanceStats[0]?.present || 0)
                },
                channels,
                activities: {
                    quotations: Number(quotationsCount[0].count || 0),
                    invoices: Number(invoicesCount[0].count || 0),
                    expenses: parseFloat(expensesSum[0].total || 0),
                    todos: Number(todosCount[0].count || 0),
                    notes: Number(notesCount[0].count || 0)
                }
            },
            revenueTrend,
            recentLeads,
            pipelineStages,
            topPerformers,
            upcomingBirthdays,
            revenueGoal,
            recentDocuments: docRows,
            upcomingTasks: focusTasks
        });

    } catch (error) {
        console.error('Main Dashboard stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getMainDashboardStats
};
