const { pool } = require('../config/db');

const CRMForm = {
    create: async (data) => {
        const { user_id, form_name, form_slug, fields, settings, status } = data;
        const [result] = await pool.query(
            'INSERT INTO crm_forms (user_id, form_name, form_slug, fields, settings, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, form_name, form_slug, JSON.stringify(fields), JSON.stringify(settings), status || 'active']
        );
        return result.insertId;
    },

    findAllByUserId: async (userId, { page = 1, limit = 10, search = '', status = '' } = {}) => {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM crm_forms WHERE user_id = ?';
        const params = [userId];

        if (search) {
            query += ' AND form_name LIKE ?';
            params.push(`%${search}%`);
        }

        if (status && status !== 'All') {
            query += ' AND status = ?';
            params.push(status.toLowerCase());
        }

        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await pool.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM crm_forms WHERE user_id = ?';
        const countParams = [userId];

        if (search) {
            countQuery += ' AND form_name LIKE ?';
            countParams.push(`%${search}%`);
        }

        if (status && status !== 'All') {
            countQuery += ' AND status = ?';
            countParams.push(status.toLowerCase());
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

    findBySlug: async (slug) => {
        const [rows] = await pool.query('SELECT * FROM crm_forms WHERE form_slug = ?', [slug]);
        return rows[0];
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM crm_forms WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },

    update: async (id, userId, data) => {
        const updates = [];
        const values = [];

        if (data.form_name) { updates.push('form_name = ?'); values.push(data.form_name); }
        if (data.fields) { updates.push('fields = ?'); values.push(JSON.stringify(data.fields)); }
        if (data.settings) { updates.push('settings = ?'); values.push(JSON.stringify(data.settings)); }
        if (data.status) { updates.push('status = ?'); values.push(data.status); }

        if (updates.length === 0) return;

        values.push(id, userId);
        await pool.query(
            `UPDATE crm_forms SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );
    },

    delete: async (id, userId) => {
        await pool.query('DELETE FROM crm_forms WHERE id = ? AND user_id = ?', [id, userId]);
    }
};

module.exports = CRMForm;
