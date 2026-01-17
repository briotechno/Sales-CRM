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
        let { name, description, key_features, price, default_users, monthly_leads, default_storage } = data;

        // Handle array type from frontend
        if (Array.isArray(key_features)) {
            key_features = key_features.join(', ');
        }

        const [result] = await pool.query(
            'INSERT INTO plans (name, description, key_features, price, default_users, monthly_leads, default_storage) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, key_features, price, default_users, monthly_leads || 0, default_storage]
        );
        return result.insertId;
    },

    update: async (id, data) => {
        let { name, description, key_features, price, default_users, monthly_leads, default_storage } = data;

        // Handle array type from frontend
        if (Array.isArray(key_features)) {
            key_features = key_features.join(', ');
        }

        await pool.query(
            'UPDATE plans SET name = ?, description = ?, key_features = ?, price = ?, default_users = ?, monthly_leads = ?, default_storage = ? WHERE id = ?',
            [name, description, key_features, price, default_users, monthly_leads || 0, default_storage, id]
        );
        return true;
    },

    delete: async (id) => {
        await pool.query('DELETE FROM plans WHERE id = ?', [id]);
        return true;
    },

    findByName: async (name) => {
        const [rows] = await pool.query('SELECT * FROM plans WHERE name = ?', [name]);
        return rows[0];
    }
};

module.exports = Plan;
