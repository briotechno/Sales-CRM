const { pool } = require('../config/db');

const LeadSyncLog = {
    create: async (data) => {
        const { user_id, channel_type, reference_id, status, message, raw_data } = data;
        const [result] = await pool.query(
            'INSERT INTO lead_sync_logs (user_id, channel_type, reference_id, status, message, raw_data) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, channel_type, reference_id, status, message, JSON.stringify(raw_data)]
        );
        return result.insertId;
    },

    findAllByUserId: async (userId, { page = 1, limit = 10 } = {}) => {
        const offset = (page - 1) * limit;
        const [rows] = await pool.query(
            'SELECT * FROM lead_sync_logs WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?',
            [userId, parseInt(limit), parseInt(offset)]
        );

        // Get total count
        const [countResult] = await pool.query('SELECT COUNT(*) as total FROM lead_sync_logs WHERE user_id = ?', [userId]);

        return {
            data: rows,
            pagination: {
                total: countResult[0].total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(countResult[0].total / limit)
            }
        };
    }
};

module.exports = LeadSyncLog;
