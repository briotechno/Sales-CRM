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
            if (source.includes('meta') || source.includes('facebook')) channels.meta = ch.count;
            else if (source.includes('justdial')) channels.justdial = ch.count;
            else if (source.includes('indiamart')) channels.indiamart = ch.count;
            else if (source.includes('google')) channels.googleDocs = ch.count;
            else channels.crmForm += ch.count;
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
                lead_id as id,
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
                SUM(l.value) as value
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
                SUM(CASE WHEN l.tag = 'Closed' THEN l.value ELSE 0 END) as revenue
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

        res.json({
            success: true,
            stats: {
                leads: {
                    total: leadsStats[0].total || 0,
                    new: leadsStats[0].new || 0,
                    unread: leadsStats[0].unread || 0,
                    dropped: leadsStats[0].dropped || 0,
                    trending: leadsStats[0].trending || 0,
                    conversionRate: parseFloat(conversionRate),
                    growth: 0 // Can be calculated from historical data
                },
                pipeline: {
                    totalValue: pipelineStats[0].totalValue || 0,
                    activeDeals: pipelineStats[0].activeDeals || 0,
                    wonDeals: pipelineStats[0].wonDeals || 0,
                    lostDeals: pipelineStats[0].lostDeals || 0,
                    avgDealSize: pipelineStats[0].avgDealSize || 0,
                    growth: 0
                },
                clients: {
                    total: clientsStats[0].total || 0,
                    active: clientsStats[0].active || 0,
                    inactive: clientsStats[0].inactive || 0,
                    newThisMonth: clientsStats[0].newThisMonth || 0,
                    growth: 0
                },
                employees: {
                    total: employeesStats[0].total || 0,
                    active: employeesStats[0].active || 0,
                    resigned: employeesStats[0].resigned || 0,
                    onLeave: attendanceStats[0]?.onLeave || 0,
                    present: attendanceStats[0]?.present || 0
                },
                channels,
                activities: {
                    quotations: quotationsCount[0].count || 0,
                    invoices: invoicesCount[0].count || 0,
                    expenses: expensesSum[0].total || 0,
                    todos: todosCount[0].count || 0,
                    notes: notesCount[0].count || 0
                }
            },
            recentLeads,
            pipelineStages,
            topPerformers,
            upcomingBirthdays
        });

    } catch (error) {
        console.error('Main Dashboard stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getMainDashboardStats
};
