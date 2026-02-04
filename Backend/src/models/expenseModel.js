const { pool } = require('../config/db');

const Expense = {
    create: async (data, userId) => {
        const { title, amount, category, date, receipt_url, status, description } = data;
        const [result] = await pool.query(
            `INSERT INTO expenses (
                title, amount, category, date, receipt_url, status, description, user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, amount, category, date, receipt_url, status || 'pending', description, userId]
        );
        return result.insertId;
    },

    findAll: async (userId, filters = {}, pagination = {}) => {
        const { search, category, status, dateFrom, dateTo } = filters;
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE user_id = ?';
        let queryParams = [userId];

        if (search) {
            whereClause += ' AND title LIKE ?';
            queryParams.push(`%${search}%`);
        }

        if (category && category !== 'All') {
            whereClause += ' AND category = ?';
            queryParams.push(category);
        }

        if (status && status !== 'All') {
            whereClause += ' AND status = ?';
            queryParams.push(status);
        }

        if (dateFrom && dateTo) {
            whereClause += ' AND date BETWEEN ? AND ?';
            queryParams.push(dateFrom, dateTo);
        }

        // 1. Get total count for pagination
        const countQuery = `SELECT COUNT(*) as total FROM expenses ${whereClause}`;
        const [countResult] = await pool.query(countQuery, queryParams);
        const total = countResult[0].total;

        // 2. Get summary stats for matrix cards (Apply the same filters here!)
        const summaryQuery = `
            SELECT 
                SUM(amount) as totalAmount,
                SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as approvedAmount,
                SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pendingAmount,
                COUNT(*) as totalCount,
                SUM(CASE WHEN receipt_url IS NOT NULL AND receipt_url != '' THEN 1 ELSE 0 END) as receiptCount,
                SUM(CASE WHEN receipt_url IS NULL OR receipt_url = '' THEN 1 ELSE 0 END) as noReceiptCount
            FROM expenses 
            ${whereClause}
        `;
        const [summaryResult] = await pool.query(summaryQuery, queryParams);

        const summary = {
            totalAmount: summaryResult[0].totalAmount || 0,
            approvedAmount: summaryResult[0].approvedAmount || 0,
            pendingAmount: summaryResult[0].pendingAmount || 0,
            totalCount: summaryResult[0].totalCount || 0,
            receiptCount: summaryResult[0].receiptCount || 0,
            noReceiptCount: summaryResult[0].noReceiptCount || 0
        };

        // 3. Get paginated results
        const listQuery = `SELECT * FROM expenses ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(listQuery, [...queryParams, parseInt(limit), parseInt(offset)]);

        return {
            expenses: rows,
            summary,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },

    update: async (id, data, userId) => {
        const fields = Object.keys(data).filter(key => key !== 'id' && key !== 'user_id' && key !== 'created_at' && key !== 'updated_at');
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = fields.map(field => data[field]);

        if (fields.length === 0) return;

        await pool.query(
            `UPDATE expenses SET ${setClause} WHERE id = ? AND user_id = ?`,
            [...values, id, userId]
        );
    },

    delete: async (id, userId) => {
        await pool.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
    }
};

module.exports = Expense;
