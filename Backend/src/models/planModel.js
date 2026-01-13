const { pool } = require('../config/db');

const Plan = {
    findAll: async ({ limit = 10, offset = 0, searchTerm = '' }) => {
        let query = 'SELECT * FROM plans';
        let params = [];

        if (searchTerm) {
            query += ' WHERE name LIKE ? OR description LIKE ?';
            params.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }

        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await pool.query(query, params);
        return rows;
    },

    countAll: async ({ searchTerm = '' }) => {
        let query = 'SELECT COUNT(*) as total FROM plans';
        let params = [];

        if (searchTerm) {
            query += ' WHERE name LIKE ? OR description LIKE ?';
            params.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }

        const [rows] = await pool.query(query, params);
        return rows[0].total;
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM plans WHERE id = ?', [id]);
        return rows[0];
    },

    create: async (data) => {
        const { name, description, price, default_users, default_leads, default_storage } = data;
        const [result] = await pool.query(
            'INSERT INTO plans (name, description, price, default_users, default_leads, default_storage) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, default_users, default_leads, default_storage]
        );
        return result.insertId;
    },

    update: async (id, data) => {
        const { name, description, price, default_users, default_leads, default_storage } = data;
        await pool.query(
            'UPDATE plans SET name = ?, description = ?, price = ?, default_users = ?, default_leads = ?, default_storage = ? WHERE id = ?',
            [name, description, price, default_users, default_leads, default_storage, id]
        );
        return true;
    },

    delete: async (id) => {
        await pool.query('DELETE FROM plans WHERE id = ?', [id]);
        return true;
    }
};

module.exports = Plan;
