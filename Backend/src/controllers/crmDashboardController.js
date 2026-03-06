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
                ROUND((SUM(CASE WHEN tag IN ('Closed', 'Won') OR status IN ('Closed', 'Won') THEN 1 ELSE 0 END) / COUNT(*)) * 100, 1) as conversion
            FROM leads
            WHERE user_id = ? AND lead_source IS NOT NULL AND lead_source != ''
            GROUP BY lead_source
            LIMIT 4
        `, [userId]);

        // 8. Funnel Data
        const [funnelStats] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status NOT IN ('Duplicate', 'Lost') THEN 1 ELSE 0 END) as contacted,
                SUM(CASE WHEN status IN ('Interested', 'Follow Up', 'Proposal', 'In Progress') THEN 1 ELSE 0 END) as qualified,
                SUM(CASE WHEN tag = 'Proposal' OR status = 'Proposal' THEN 1 ELSE 0 END) as proposal,
                SUM(CASE WHEN tag IN ('Closed', 'Won') OR status IN ('Closed', 'Won') THEN 1 ELSE 0 END) as won
            FROM leads WHERE user_id = ?
        `, [userId]);

        const funnelData = [
            { name: "Total Leads", value: Number(funnelStats[0].total || 0), fill: "#94a3b8" },
            { name: "Contacted", value: Number(funnelStats[0].contacted || 0), fill: "#60a5fa" },
            { name: "Qualified", value: Number(funnelStats[0].qualified || 0), fill: "#facc15" },
            { name: "Proposal", value: Number(funnelStats[0].proposal || 0), fill: "#fb923c" },
            { name: "Won", value: Number(funnelStats[0].won || 0), fill: "#22c55e" },
        ];

        // 9. Aging Stats
        const [agingRows] = await pool.query(`
            SELECT 
                SUM(CASE WHEN updated_at <= DATE_SUB(NOW(), INTERVAL 3 DAY) AND tag NOT IN ('Closed', 'Lost') THEN 1 ELSE 0 END) as warning,
                SUM(CASE WHEN updated_at <= DATE_SUB(NOW(), INTERVAL 7 DAY) AND tag NOT IN ('Closed', 'Lost') THEN 1 ELSE 0 END) as critical,
                SUM(CASE WHEN tag = 'Missed' OR status = 'Missed' THEN 1 ELSE 0 END) as missed
            FROM leads WHERE user_id = ?
        `, [userId]);

        const agingStats = [
            { label: "Leads Stagnant (3+ Days)", count: Number(agingRows[0].warning || 0), status: "Warning" },
            { label: "Leads Stagnant (7+ Days)", count: Number(agingRows[0].critical || 0), status: "Critical" },
            { label: "Overdue Follow-ups", count: Number(agingRows[0].missed || 0), status: "Alert" },
        ];

        // 10. Win/Loss Data
        const [winLossRows] = await pool.query(`
            SELECT 
                DATE_FORMAT(updated_at, '%b') as month,
                SUM(CASE WHEN tag IN ('Closed', 'Won') OR status IN ('Closed', 'Won') THEN 1 ELSE 0 END) as won,
                SUM(CASE WHEN tag = 'Lost' OR status = 'Lost' THEN 1 ELSE 0 END) as lost
            FROM leads 
            WHERE user_id = ? AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY month, MONTH(updated_at)
            ORDER BY MONTH(updated_at) ASC
        `, [userId]);

        // 11. Territory Split
        const [territoryRows] = await pool.query(`
            SELECT 
                COALESCE(city, 'Other') as area,
                COUNT(*) as count
            FROM leads 
            WHERE user_id = ? AND city IS NOT NULL AND city != ''
            GROUP BY city ORDER BY count DESC LIMIT 4
        `, [userId]);

        const totalTerritoryLeads = territoryRows.reduce((acc, curr) => acc + curr.count, 0);
        const regionSales = territoryRows.map((row, i) => ({
            area: row.area,
            value: totalTerritoryLeads > 0 ? Math.round((row.count / totalTerritoryLeads) * 100) : 0,
            color: ["#fb923c", "#60a5fa", "#a855f7", "#94a3b8"][i % 4]
        }));

        // 12. Drop Analysis
        const [dropRows] = await pool.query(`
            SELECT 
                COALESCE(drop_reason, 'No Reason') as name,
                COUNT(*) as count
            FROM leads 
            WHERE user_id = ? AND (tag = 'Lost' OR status = 'Lost')
            GROUP BY drop_reason ORDER BY count DESC LIMIT 5
        `, [userId]);

        const totalDropped = dropRows.reduce((sum, r) => sum + r.count, 0);
        const dropAnalysis = dropRows.map((r, i) => ({
            name: r.name,
            value: totalDropped > 0 ? Math.round((r.count / totalDropped) * 100) : 0,
            fill: ["#f97316", "#60a5fa", "#a855f7", "#f43f5e", "#94a3b8"][i % 5]
        }));

        // 13. Efficiency Metrics (Row 2)
        const [avgResponse] = await pool.query(`
            SELECT ROUND(AVG(TIMESTAMPDIFF(MINUTE, l.created_at, lc.created_at)), 1) as response_time
            FROM leads l
            JOIN lead_calls lc ON l.id = lc.lead_id
            WHERE l.user_id = ? AND lc.created_at = (SELECT MIN(created_at) FROM lead_calls WHERE lead_id = l.id)
        `, [userId]);

        const [followupSuccess] = await pool.query(`
            SELECT ROUND((SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 1) as success_rate
            FROM tasks WHERE user_id = ?
        `, [userId]);

        const [salesVelocity] = await pool.query(`
            SELECT ROUND(SUM(total_amount) / 30, 1) as velocity
            FROM invoices WHERE user_id = ? AND status = 'Paid' AND invoice_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        `, [userId]);

        // 14. Live Activity Feed
        const [activities] = await pool.query(`
            SELECT 
                la.activity_type as action, la.title as target, la.description as to_text, 
                la.created_at, CONCAT(u.firstName, ' ', u.lastName) as user,
                LEFT(u.firstName, 1) as avatar,
                TIMESTAMPDIFF(MINUTE, la.created_at, NOW()) as minutes_ago
            FROM lead_activities la
            JOIN users u ON la.user_id = u.id
            WHERE la.user_id = ? OR la.lead_id IN (SELECT id FROM leads WHERE user_id = ?)
            ORDER BY la.created_at DESC LIMIT 10
        `, [userId, userId]);

        const mockActivityFeed = activities.map(a => ({
            id: a.id,
            user: a.user,
            action: a.action,
            target: a.target,
            to: a.to_text,
            time: a.minutes_ago < 60 ? `${a.minutes_ago}m ago` : a.minutes_ago < 1440 ? `${Math.floor(a.minutes_ago / 60)}h ago` : `${Math.floor(a.minutes_ago / 1440)}d ago`,
            avatar: a.avatar
        }));

        // 15. Revenue Forecast Comparison
        const [forecastRows] = await pool.query(`
            SELECT 
                DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL n MONTH), '%b') as month,
                SUM(l.value) as expected,
                SUM(l.value * 0.4) as weighted,
                SUM(l.value * 1.2) as bestCase
            FROM (SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) months
            CROSS JOIN leads l
            WHERE l.user_id = ? AND l.tag NOT IN ('Closed', 'Lost')
            GROUP BY month
            ORDER BY MIN(months.n)
        `, [userId]);

        // 16. Velocity Drivers
        const [velocityDrivers] = await pool.query(`
            SELECT 
                ROUND((SUM(CASE WHEN tag IN ('Closed', 'Won') THEN 1 ELSE 0 END) / COUNT(*)) * 100, 1) as win_rate,
                ROUND(AVG(TIMESTAMPDIFF(DAY, created_at, updated_at)), 0) as cycle_time,
                ROUND(AVG(CASE WHEN tag IN ('Closed', 'Won') THEN value ELSE NULL END), 0) as avg_deal_size
            FROM leads WHERE user_id = ?
        `, [userId, userId]);

        // 17. Daily Goal Pulse
        const [dailyRevenue] = await pool.query(`
            SELECT SUM(total_amount) as total FROM invoices 
            WHERE user_id = ? AND status = 'Paid' AND invoice_date = CURDATE()
        `, [userId]);

        // 18. Workload & Team (Restored)
        const [workloadRows] = await pool.query(`
            SELECT e.employee_name as name, COUNT(l.id) as leads
            FROM employees e
            LEFT JOIN leads l ON e.id = l.assigned_to OR e.employee_id = l.assigned_to
            WHERE e.user_id = ?
            GROUP BY e.id LIMIT 4
        `, [userId]);

        const workloadData = workloadRows.map((w, i) => ({
            name: w.name,
            leads: Number(w.leads),
            capacity: 100,
            color: ["#fb923c", "#60a5fa", "#f43f5e", "#22c55e"][i % 4]
        }));

        const [teamRows] = await pool.query(`
            SELECT 
                e.id, e.employee_name as name,
                LEFT(e.employee_name, 2) as avatar,
                COUNT(l.id) as leads,
                SUM(CASE WHEN l.tag IN ('Closed', 'Won') OR l.status IN ('Closed', 'Won') THEN 1 ELSE 0 END) as converted,
                ROUND((SUM(CASE WHEN l.tag IN ('Closed', 'Won') OR l.status IN ('Closed', 'Won') THEN 1 ELSE 0 END) / NULLIF(COUNT(l.id), 0)) * 100, 1) as rate
            FROM employees e
            LEFT JOIN leads l ON e.id = l.assigned_to OR e.employee_id = l.assigned_to
            WHERE e.user_id = ?
            GROUP BY e.id
            ORDER BY converted DESC LIMIT 5
        `, [userId]);

        // 19. Growth (Restored)
        const [prevMonthStats] = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM quotations WHERE user_id = ? AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)) as quotCount,
                (SELECT COUNT(*) FROM leads WHERE user_id = ? AND tag IN ('Closed', 'Won') AND updated_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)) as convCount
            FROM DUAL
        `, [userId, userId]);

        const calculateGrowth = (current, previous) => {
            if (!previous || previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        const growth = {
            quotations: calculateGrowth(quotStats[0].total, prevMonthStats[0].quotCount),
            conversions: calculateGrowth(conversionStats[0].total, prevMonthStats[0].convCount)
        };

        res.json({
            success: true,
            summary: {
                totalQuotations: Number(quotStats[0].total || 0),
                totalQuotationsTrend: `${growth.quotations >= 0 ? '+' : ''}${growth.quotations}%`,
                conversions: Number(conversionStats[0].total || 0),
                conversionsTrend: `${growth.conversions >= 0 ? '+' : ''}${growth.conversions}%`,
                revenue: parseFloat(revenueStats[0].total || 0),
                champions: Number(championCount[0].total || 0)
            },
            efficiencyMetrics: [
                { label: "Avg. Response Time", value: `${avgResponse[0].response_time || 0}m` },
                { label: "Follow-up Success", value: `${followupSuccess[0].success_rate || 0}%` },
                { label: "Sales Velocity", value: `₹${(salesVelocity[0].velocity || 0).toLocaleString()}/day` },
                { label: "Marketing ROI", value: "5.2x" } // Placeholder as ROI needs investment data
            ],
            revenueTrend,
            recentLeads: recentLeads.map(l => ({ ...l, value: parseFloat(l.value || 0) })),
            upcomingTasks,
            champions: champions.map((c, i) => ({
                ...c,
                revenue: Number(c.revenue || 0),
                badge: i === 0 ? "🏆" : i === 1 ? "⭐" : "🎯"
            })),
            pipelineData: pipelineStats.map(p => ({ ...p, value: parseFloat(p.value || 0) })),
            funnelData,
            agingStats,
            winLossData: winLossRows,
            regionSales,
            dropAnalysis,
            workloadData,
            teamPerformance: teamRows.map(r => ({ ...r, leads: Number(r.leads), converted: Number(r.converted), rate: parseFloat(r.rate || 0) })),
            activityFeed: mockActivityFeed,
            revenueForecast: forecastRows,
            velocityDrivers: {
                winRate: velocityDrivers[0].win_rate || 0,
                cycleTime: velocityDrivers[0].cycle_time || 0,
                avgDealSize: velocityDrivers[0].avg_deal_size || 0
            },
            dailyGoal: {
                current: parseFloat(dailyRevenue[0].total || 0),
                target: 72000 // Placeholder target
            }
        });

    } catch (error) {
        console.error('CRM Dashboard stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDashboardStats
};
