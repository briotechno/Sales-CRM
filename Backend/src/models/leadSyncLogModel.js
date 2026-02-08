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

    findAllByUserId: async (userId, { page = 1, limit = 10, channel_type = '' } = {}) => {
        const offset = (page - 1) * limit;

        // Base query
        let query = 'SELECT * FROM lead_sync_logs WHERE user_id = ?';
        const params = [userId];

        // Add filter if channel_type is provided
        if (channel_type) {
            query += ' AND channel_type = ?';
            params.push(channel_type);
        }

        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await pool.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM lead_sync_logs WHERE user_id = ?';
        const countParams = [userId];

        if (channel_type) {
            countQuery += ' AND channel_type = ?';
            countParams.push(channel_type);
        }

        const [countResult] = await pool.query(countQuery, countParams);

        return {
            data: rows,
            pagination: {
                total: countResult[0].total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(countResult[0].total / limit)
            }
        };
    },

    deleteByReferenceId: async (user_id, reference_id, channel_type) => {
        await pool.query(
            'DELETE FROM lead_sync_logs WHERE user_id = ? AND reference_id = ? AND channel_type = ?',
            [user_id, reference_id, channel_type]
        );
    }
};

module.exports = LeadSyncLog;
