const { pool } = require('../config/db');

const getDateCondition = (columnName, period) => {
    switch (period) {
        case 'Today':
            return `DATE(${columnName}) = CURDATE()`;
        case 'Last 7 Days':
            return `${columnName} >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`;
        case 'Last 30 Days':
            return `${columnName} >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
        case 'Last 6 Months':
            return `${columnName} >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)`;
        case 'Last 1 Year':
            return `${columnName} >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)`;
        case 'All Time':
            return '1=1';
        default:
            return `${columnName} >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)`;
    }
};

const getGranularity = (period) => {
    if (['Last 6 Months', 'Last 1 Year', 'All Time', 'Default'].includes(period)) {
        return { label: "%b", group: "%Y-%m" };
    }
    return { label: "%b %d", group: "%Y-%m-%d" };
};

const superAdminDashboardController = {

    // ── TOP STATS ──────────────────────────────────────────────
    // GET /api/super-admin/dashboard-stats
    getDashboardStats: async (req, res) => {
        try {
            const { period = 'Last 6 Months' } = req.query;

            // Total enterprises
            const [totalEnt] = await pool.query('SELECT COUNT(*) as count FROM enterprises');
            // Active subscriptions
            const [activeSubs] = await pool.query('SELECT COUNT(*) as count FROM subscriptions WHERE status = "Active"');
            // Total users across all enterprises
            const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role != "SuperAdmin"');

            // Period-based revenue
            const dateCond = getDateCondition('onboardingDate', period);
            const [periodRevenue] = await pool.query(
                `SELECT COALESCE(SUM(amount), 0) as total FROM subscriptions 
                 WHERE status = "Active" AND ${dateCond}`
            );

            res.json({
                success: true,
                data: {
                    totalEnterprises: totalEnt[0].count || 0,
                    activeSubscriptions: activeSubs[0].count || 0,
                    totalUsers: totalUsers[0].count || 0,
                    monthlyRevenue: periodRevenue[0].total || 0, // Dynamic revenue based on filter
                }
            });
        } catch (error) {
            console.error('SuperAdmin Dashboard Stats Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // ── ENTERPRISE GROWTH CHART ────────────────────────────────
    // GET /api/super-admin/enterprise-growth
    getEnterpriseGrowth: async (req, res) => {
        try {
            const { period = 'Last 6 Months' } = req.query;
            const dateCond = getDateCondition('created_at', period);
            const gran = getGranularity(period);

            const [rows] = await pool.query(`
                SELECT 
                    DATE_FORMAT(created_at, '${gran.label}') as month,
                    DATE_FORMAT(created_at, '${gran.group}') as yearMonth,
                    COUNT(*) as enterprises
                FROM enterprises 
                WHERE ${dateCond}
                GROUP BY yearMonth, month
                ORDER BY yearMonth ASC
            `);

            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Enterprise Growth Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // ── REVENUE ANALYTICS ─────────────────────────────────────
    // GET /api/super-admin/revenue-analytics
    getRevenueAnalytics: async (req, res) => {
        try {
            const { period = 'Last 6 Months' } = req.query;
            const dateCond = getDateCondition('onboardingDate', period);
            const gran = getGranularity(period);

            const [rows] = await pool.query(`
                SELECT 
                    DATE_FORMAT(onboardingDate, '${gran.label}') as month,
                    DATE_FORMAT(onboardingDate, '${gran.group}') as yearMonth,
                    COALESCE(SUM(amount), 0) as revenue
                FROM subscriptions 
                WHERE ${dateCond}
                GROUP BY yearMonth, month
                ORDER BY yearMonth ASC
            `);

            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Revenue Analytics Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // ── SUBSCRIPTION DISTRIBUTION ─────────────────────────────
    // GET /api/super-admin/subscription-distribution
    getSubscriptionDistribution: async (req, res) => {
        try {
            const { period = 'Last 6 Months' } = req.query;
            const dateCond = getDateCondition('onboardingDate', period);

            const [rows] = await pool.query(`
                SELECT plan as name, COUNT(*) as value 
                FROM subscriptions 
                WHERE status = "Active" AND plan IS NOT NULL AND ${dateCond}
                GROUP BY plan
                ORDER BY value DESC
            `);

            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Subscription Distribution Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // ── UPGRADE / DOWNGRADE TRENDS ────────────────────────────
    // GET /api/super-admin/upgrade-downgrade-trends
    getUpgradeDowngradeTrends: async (req, res) => {
        try {
            const { period = 'Last 6 Months' } = req.query;
            const dateCond = getDateCondition('created_at', period);
            const gran = getGranularity(period);

            const [rows] = await pool.query(`
                SELECT 
                    DATE_FORMAT(created_at, '${gran.label}') as month,
                    DATE_FORMAT(created_at, '${gran.group}') as yearMonth,
                    COUNT(CASE WHEN plan IN ('Enterprise', 'Professional') THEN 1 END) as upgrades,
                    COUNT(CASE WHEN plan IN ('Basic', 'Starter') THEN 1 END) as downgrades
                FROM subscriptions 
                WHERE ${dateCond}
                GROUP BY yearMonth, month
                ORDER BY yearMonth ASC
            `);

            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Upgrade/Downgrade Trends Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // ── PRODUCT KEY STATS ─────────────────────────────────────
    // GET /api/super-admin/product-key-stats
    getProductKeyStats: async (req, res) => {
        try {
            const { period = 'Last 6 Months' } = req.query;
            const dateCond = getDateCondition('created_at', period);

            const [generatedRows] = await pool.query(
                `SELECT COUNT(*) as count FROM product_keys WHERE ${dateCond}`
            );
            const [redeemedRows] = await pool.query(
                `SELECT COUNT(*) as count FROM product_keys WHERE status = "Active" AND ${dateCond}`
            );
            const [expiredUnused] = await pool.query(
                'SELECT COUNT(*) as count FROM product_keys WHERE status = "Pending" AND expiresOn < CURDATE()'
            );
            const [totalActive] = await pool.query(
                'SELECT COUNT(*) as count FROM product_keys WHERE status = "Active"'
            );

            res.json({
                success: true,
                data: {
                    generatedToday: generatedRows[0].count || 0,
                    redeemedToday: redeemedRows[0].count || 0,
                    expiredUnused: expiredUnused[0].count || 0,
                    totalActive: totalActive[0].count || 0,
                }
            });
        } catch (error) {
            console.error('Product Key Stats Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // ── CHURN ALERTS ──────────────────────────────────────────
    // GET /api/super-admin/churn-alerts
    getChurnAlerts: async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    s.id,
                    s.enterprise_name as enterprise,
                    s.plan,
                    s.status,
                    s.expiryDate,
                    DATEDIFF(s.expiryDate, CURDATE()) as daysLeft,
                    e.city,
                    CASE 
                        WHEN DATEDIFF(s.expiryDate, CURDATE()) <= 3 THEN 'Critical'
                        WHEN DATEDIFF(s.expiryDate, CURDATE()) <= 7 THEN 'Warning'
                        ELSE 'Notice'
                    END as alertStatus
                FROM subscriptions s
                LEFT JOIN enterprises e ON s.enterprise_id = e.id
                WHERE s.status = 'Active' 
                AND s.expiryDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 14 DAY)
                ORDER BY s.expiryDate ASC
                LIMIT 10
            `);

            const alerts = rows.map(row => ({
                ...row,
                reason: row.daysLeft <= 3 ? 'Subscription Expiring Soon' :
                    row.daysLeft <= 7 ? 'Auto-renew Check Required' : 'Upcoming Renewal',
            }));

            res.json({ success: true, data: alerts });
        } catch (error) {
            console.error('Churn Alerts Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // ── RECENT ENTERPRISES ────────────────────────────────────
    // GET /api/super-admin/recent-enterprises
    getRecentEnterprises: async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    e.id,
                    e.businessName as name,
                    e.ownerName as owner,
                    DATE_FORMAT(e.created_at, '%Y-%m-%d') as date,
                    e.plan,
                    e.status,
                    e.city
                FROM enterprises e
                ORDER BY e.created_at DESC
                LIMIT 8
            `);

            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Recent Enterprises Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // ── USER & PRODUCT USAGE ──────────────────────────────────────────────────────────────
    // GET /api/super-admin/usage-stats
    getUsageStats: async (req, res) => {
        try {
            const { period = 'Last 30 Days' } = req.query;
            const today = new Date().toISOString().split('T')[0];
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            // ── DAU: users who logged in today
            const [dauRows] = await pool.query(
                `SELECT COUNT(DISTINCT id) as count FROM users 
                 WHERE DATE(last_login) = ? AND role != 'SuperAdmin'`,
                [today]
            );

            // ── WAU: users who logged in in last 7 days
            const [wauRows] = await pool.query(
                `SELECT COUNT(DISTINCT id) as count FROM users 
                 WHERE DATE(last_login) >= ? AND role != 'SuperAdmin'`,
                [weekAgo]
            );

            // ── Total non-super-admin users (denominator for all % calculations)
            const [totalUsersRows] = await pool.query(
                `SELECT COUNT(*) as count FROM users WHERE role != 'SuperAdmin'`
            );
            const totalUsers = Math.max(parseInt(totalUsersRows[0].count) || 1, 1);

            // ── Feature usage: distinct users who ACTUALLY CREATED/USED each feature in SELECTED period
            const dateCond = getDateCondition('created_at', period);

            const [leadsUsers] = await pool.query(
                `SELECT COUNT(DISTINCT user_id) as count FROM leads WHERE ${dateCond}`
            );
            const [tasksUsers] = await pool.query(
                `SELECT COUNT(DISTINCT user_id) as count FROM tasks WHERE ${dateCond}`
            );
            const [invoiceUsers] = await pool.query(
                `SELECT COUNT(DISTINCT user_id) as count FROM invoices WHERE ${dateCond}`
            );
            const [campaignUsers] = await pool.query(
                `SELECT COUNT(DISTINCT user_id) as count FROM campaigns WHERE ${dateCond}`
            );
            const [clientUsers] = await pool.query(
                `SELECT COUNT(DISTINCT user_id) as count FROM clients WHERE ${dateCond}`
            );

            // ── Calculate real adoption % = (users who used feature / total users) * 100
            const calcPct = (count) => Math.min(Math.round((parseInt(count) / totalUsers) * 100), 100);

            const featureUsage = [
                {
                    name: 'CRM & Leads',
                    usage: calcPct(leadsUsers[0].count),
                    activeUsers: parseInt(leadsUsers[0].count),
                },
                {
                    name: 'Client Management',
                    usage: calcPct(clientUsers[0].count),
                    activeUsers: parseInt(clientUsers[0].count),
                },
                {
                    name: 'Task Management',
                    usage: calcPct(tasksUsers[0].count),
                    activeUsers: parseInt(tasksUsers[0].count),
                },
                {
                    name: 'Campaign Management',
                    usage: calcPct(campaignUsers[0].count),
                    activeUsers: parseInt(campaignUsers[0].count),
                },
                {
                    name: 'Invoices & Billing',
                    usage: calcPct(invoiceUsers[0].count),
                    activeUsers: parseInt(invoiceUsers[0].count),
                },
            ];

            res.json({
                success: true,
                data: {
                    dailyActiveUsers: parseInt(dauRows[0].count) || 0,
                    weeklyActiveUsers: parseInt(wauRows[0].count) || 0,
                    totalUsers,
                    avgSessionDuration: '18m 34s', // Placeholder — needs dedicated session tracking
                    featureUsage,
                }
            });
        } catch (error) {
            console.error('Usage Stats Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },
};

module.exports = superAdminDashboardController;
