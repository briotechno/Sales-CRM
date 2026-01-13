const { pool } = require('../config/db');

const Subscription = {
    create: async (data) => {
        const { name, plan, status, users, amount, billingCycle, onboardingDate, expiryDate, leads, storage, features } = data;
        const [result] = await pool.query(
            `INSERT INTO subscriptions (enterprise_name, plan, status, users, amount, billingCycle, onboardingDate, expiryDate, leads, storage, features) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, plan, status || 'Active', users || 0, amount || 0.00, billingCycle || 'Monthly', onboardingDate, expiryDate, leads, storage, JSON.stringify(features || [])]
        );
        return result.insertId;
    },

    findAll: async (filters = {}) => {
        let query = 'SELECT * FROM subscriptions WHERE 1=1';
        const params = [];

        if (filters.status && filters.status !== 'all') {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.searchTerm) {
            query += ' AND (enterprise_name LIKE ? OR id LIKE ?)';
            const term = `%${filters.searchTerm}%`;
            params.push(term, term);
        }

        query += ' ORDER BY created_at DESC';

        if (filters.limit && filters.offset !== undefined) {
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(filters.limit), parseInt(filters.offset));
        }

        const [rows] = await pool.query(query, params);
        return rows;
    },

    countAll: async (filters = {}) => {
        let query = 'SELECT COUNT(*) as total FROM subscriptions WHERE 1=1';
        const params = [];

        if (filters.status && filters.status !== 'all') {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.searchTerm) {
            query += ' AND (enterprise_name LIKE ? OR id LIKE ?)';
            const term = `%${filters.searchTerm}%`;
            params.push(term, term);
        }

        const [rows] = await pool.query(query, params);
        return rows[0].total;
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM subscriptions WHERE id = ?', [id]);
        return rows[0];
    },

    update: async (id, data) => {
        const { name, plan, status, users, amount, billingCycle, onboardingDate, expiryDate, leads, storage, features } = data;
        const [result] = await pool.query(
            `UPDATE subscriptions SET 
             enterprise_name = ?, plan = ?, status = ?, users = ?, amount = ?, billingCycle = ?, onboardingDate = ?, expiryDate = ?, leads = ?, storage = ?, features = ? 
             WHERE id = ?`,
            [name, plan, status, users, amount, billingCycle, onboardingDate, expiryDate, leads, storage, JSON.stringify(features || []), id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM subscriptions WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Subscription;
