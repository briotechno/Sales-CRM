const { pool } = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Summary Stats
        const [quotStats] = await pool.query(
            'SELECT COUNT(*) as total FROM quotations WHERE user_id = ?',
            [userId]
        );

        const [conversionStats] = await pool.query(
            "SELECT COUNT(*) as total FROM leads WHERE user_id = ? AND tag = 'Closed'",
            [userId]
        );

        const [revenueStats] = await pool.query(
            "SELECT SUM(total_amount) as total FROM invoices WHERE user_id = ? AND status = 'Paid'",
            [userId]
        );

        const [championCount] = await pool.query(
            "SELECT COUNT(DISTINCT assigned_to) as total FROM leads WHERE user_id = ? AND tag = 'Closed'",
            [userId]
        );

        // 2. Revenue Trend (Last 6 Months)
        const [revenueTrend] = await pool.query(`
            SELECT 
                DATE_FORMAT(invoice_date, '%b') as month,
                SUM(total_amount) / 100000 as revenue
            FROM invoices 
            WHERE user_id = ? AND status = 'Paid'
            AND invoice_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY month, MONTH(invoice_date)
            ORDER BY MONTH(invoice_date) ASC
        `, [userId]);

        // 3. Recent Leads
        const [recentLeads] = await pool.query(`
            SELECT 
                name, organization_name as company, status, value, email, lead_source as source,
                LEFT(name, 2) as avatar
            FROM leads 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 5
        `, [userId]);

        // 4. Upcoming Tasks
        const [upcomingTasks] = await pool.query(`
            SELECT 
                title as task, priority, 
                CONCAT(DATE_FORMAT(due_date, '%W'), ', ', DATE_FORMAT(due_time, '%h:%i %p')) as dueTime
            FROM tasks 
            WHERE user_id = ? AND (due_date >= CURDATE())
            ORDER BY due_date ASC, due_time ASC 
            LIMIT 5
        `, [userId]);

        // 5. Champions (Top Employees)
        const [champions] = await pool.query(`
            SELECT 
                e.employee_name as name,
                COUNT(l.id) as deals,
                SUM(l.value) as revenue,
                LEFT(e.employee_name, 2) as avatar
            FROM employees e
            JOIN leads l ON e.id = l.assigned_to
            WHERE l.user_id = ? AND l.tag = 'Closed'
            GROUP BY e.id
            ORDER BY revenue DESC
            LIMIT 3
        `, [userId]);

        // 6. Pipeline Data
        const [pipelineStats] = await pool.query(`
            SELECT 
                p.name,
                COUNT(DISTINCT s.id) as stages,
                COUNT(l.id) as deals,
                SUM(l.value) as value
            FROM pipelines p
            LEFT JOIN pipeline_stages s ON p.id = s.pipeline_id
            LEFT JOIN leads l ON p.id = l.pipeline_id
            WHERE p.user_id = ?
            GROUP BY p.id
        `, [userId]);

        // 7. Channels (Lead Sources)
        const [channels] = await pool.query(`
            SELECT 
                lead_source as name,
                COUNT(*) as leads,
                CONCAT(ROUND((SUM(CASE WHEN tag = 'Closed' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 1), '%') as conversion
            FROM leads
            WHERE user_id = ? AND lead_source IS NOT NULL AND lead_source != ''
            GROUP BY lead_source
            LIMIT 4
        `, [userId]);

        res.json({
            success: true,
            summary: {
                totalQuotations: quotStats[0].total || 0,
                conversions: conversionStats[0].total || 0,
                revenue: revenueStats[0].total || 0,
                champions: championCount[0].total || 0
            },
            revenueTrend,
            recentLeads,
            upcomingTasks,
            champions: champions.map((c, i) => ({
                ...c,
                revenue: `₹${(c.revenue / 100000).toFixed(2)}L`,
                badge: i === 0 ? "🏆" : i === 1 ? "⭐" : "🎯"
            })),
            pipelineData: pipelineStats,
            channels: channels.map(c => ({
                ...c,
                icon: c.name === 'Website' ? '📧' : c.name === 'Referral' ? '🤝' : '🎯',
                color: 'from-orange-400 to-orange-600'
            }))
        });

    } catch (error) {
        console.error('CRM Dashboard stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDashboardStats
};
