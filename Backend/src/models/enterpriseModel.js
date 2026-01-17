const { pool } = require('../config/db');

const Enterprise = {
    create: async (data) => {
        const { admin_id, firstName, lastName, email, mobileNumber, businessName, businessType, gst, address, plan, status, onboardingDate } = data;
        const [result] = await pool.query(
            `INSERT INTO enterprises (admin_id, firstName, lastName, email, mobileNumber, businessName, businessType, gst, address, plan, status, onboardingDate) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [admin_id, firstName, lastName, email, mobileNumber, businessName, businessType, gst, address, plan || 'Starter', status || 'Active', onboardingDate]
        );
        return result.insertId;
    },

    findAll: async (filters = {}) => {
        let query = 'SELECT * FROM enterprises WHERE 1=1';
        const params = [];

        if (filters.status && filters.status !== 'all') {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.searchTerm) {
            query += ' AND (businessName LIKE ? OR firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)';
            const term = `%${filters.searchTerm}%`;
            params.push(term, term, term, term);
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
        let query = 'SELECT COUNT(*) as total FROM enterprises WHERE 1=1';
        const params = [];

        if (filters.status && filters.status !== 'all') {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.searchTerm) {
            query += ' AND (businessName LIKE ? OR firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)';
            const term = `%${filters.searchTerm}%`;
            params.push(term, term, term, term);
        }

        const [rows] = await pool.query(query, params);
        return rows[0].total;
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM enterprises WHERE id = ?', [id]);
        return rows[0];
    },

    findByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM enterprises WHERE email = ?', [email]);
        return rows[0];
    },

    findByAdminId: async (adminId) => {
        const [rows] = await pool.query('SELECT * FROM enterprises WHERE admin_id = ?', [adminId]);
        return rows[0];
    },

    update: async (id, data) => {
        const { admin_id, firstName, lastName, email, mobileNumber, businessName, businessType, gst, address, plan, status, onboardingDate } = data;
        const [result] = await pool.query(
            `UPDATE enterprises SET 
             admin_id = ?, firstName = ?, lastName = ?, email = ?, mobileNumber = ?, businessName = ?, businessType = ?, gst = ?, address = ?, plan = ?, status = ?, onboardingDate = ? 
             WHERE id = ?`,
            [admin_id, firstName, lastName, email, mobileNumber, businessName, businessType, gst, address, plan, status, onboardingDate, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM enterprises WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Enterprise;
