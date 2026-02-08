const { pool } = require('../config/db');

const GoogleSheetsConfig = {
    create: async (data) => {
        const { user_id, sheet_name, spreadsheet_id, sheet_id, credentials_json, field_mapping, sync_frequency } = data;
        const [result] = await pool.query(
            'INSERT INTO google_sheets_configs (user_id, sheet_name, spreadsheet_id, sheet_id, credentials_json, field_mapping, sync_frequency) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, sheet_name, spreadsheet_id, sheet_id, credentials_json, JSON.stringify(field_mapping), sync_frequency || 'manual']
        );
        return result.insertId;
    },

    findAllByUserId: async (userId, { page = 1, limit = 10, search = '', sync_frequency = '' } = {}) => {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM google_sheets_configs WHERE user_id = ?';
        const params = [userId];

        if (search) {
            query += ' AND sheet_name LIKE ?';
            params.push(`%${search}%`);
        }

        if (sync_frequency && sync_frequency !== 'All') {
            query += ' AND sync_frequency = ?';
            params.push(sync_frequency.toLowerCase());
        }

        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await pool.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM google_sheets_configs WHERE user_id = ?';
        const countParams = [userId];

        if (search) {
            countQuery += ' AND sheet_name LIKE ?';
            countParams.push(`%${search}%`);
        }

        if (sync_frequency && sync_frequency !== 'All') {
            countQuery += ' AND sync_frequency = ?';
            countParams.push(sync_frequency.toLowerCase());
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

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM google_sheets_configs WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },

    update: async (id, userId, data) => {
        const updates = [];
        const values = [];

        if (data.sheet_name) { updates.push('sheet_name = ?'); values.push(data.sheet_name); }
        if (data.spreadsheet_id) { updates.push('spreadsheet_id = ?'); values.push(data.spreadsheet_id); }
        if (data.sheet_id) { updates.push('sheet_id = ?'); values.push(data.sheet_id); }
        if (data.credentials_json) { updates.push('credentials_json = ?'); values.push(data.credentials_json); }
        if (data.field_mapping) { updates.push('field_mapping = ?'); values.push(JSON.stringify(data.field_mapping)); }
        if (data.sync_frequency) { updates.push('sync_frequency = ?'); values.push(data.sync_frequency); }
        if (data.last_sync_at) { updates.push('last_sync_at = ?'); values.push(data.last_sync_at); }
        if (data.status) { updates.push('status = ?'); values.push(data.status); }

        if (updates.length === 0) return;

        values.push(id, userId);
        await pool.query(
            `UPDATE google_sheets_configs SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );
    },

    delete: async (id, userId) => {
        await pool.query('DELETE FROM google_sheets_configs WHERE id = ? AND user_id = ?', [id, userId]);
    }
};

module.exports = GoogleSheetsConfig;
