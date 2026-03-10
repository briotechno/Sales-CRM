const { pool } = require('../config/db');

const getWalletStats = async (req, res) => {
    try {
        const [totalRows] = await pool.query('SELECT SUM(amount) as total FROM subscriptions');
        const [usedRows] = await pool.query('SELECT SUM(amount) as used FROM subscriptions WHERE status = "Active"');

        const totalAmount = totalRows[0].total || 0;
        const usedAmount = usedRows[0].used || 0;
        const restAmount = totalAmount - usedAmount;

        res.status(200).json({
            success: true,
            data: {
                totalAmount: parseFloat(totalAmount),
                usedAmount: parseFloat(usedAmount),
                restAmount: parseFloat(restAmount),
                lastTransaction: "Recently"
            }
        });
    } catch (error) {
        console.error('Get Wallet Stats error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

const getUpgradeHistory = async (req, res) => {
    try {
        const { plan, searchTerm, page = 1, limit = 10 } = req.query;
        let query = 'SELECT * FROM subscriptions WHERE 1=1';
        const params = [];

        if (plan && plan !== 'all') {
            query += ' AND plan = ?';
            params.push(plan);
        }

        if (searchTerm) {
            query += ' AND (enterprise_name LIKE ? OR id LIKE ?)';
            const term = `%${searchTerm}%`;
            params.push(term, term);
        }

        query += ' ORDER BY created_at DESC';

        // Count for pagination
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.query(countQuery, params);
        const total = countResult[0].total;

        // Pagination limits
        const offset = (page - 1) * limit;
        if (limit) {
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(limit), parseInt(offset));
        }

        const [rows] = await pool.query(query, params);

        // Map to UI friendly format
        const history = rows.map(row => {
            const dateObj = new Date(row.created_at);
            return {
                id: `UPG-${row.id}`,
                enterprise: row.enterprise_name || 'N/A',
                previousPlan: "Previous Plan", // Simulated since no previous plan tracking
                newPlan: row.plan || 'N/A',
                amount: parseFloat(row.amount) || 0,
                date: dateObj.toISOString().split('T')[0],
                time: dateObj.toTimeString().split(' ')[0].substring(0, 5),
                status: row.status
            };
        });

        res.status(200).json({
            success: true,
            data: history,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get Upgrade History error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

module.exports = {
    getWalletStats,
    getUpgradeHistory
};
