const { pool } = require('../config/db');

const CompanyPolicy = {
    create: async (data, userId) => {
        const { title, category, effective_date, review_date, version, description, author, status } = data;
        const [result] = await pool.query(
            `INSERT INTO company_policies 
            (title, category, effective_date, review_date, version, description, author, status, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, category, effective_date, review_date, version || '1.0', description, author, status || 'Active', userId]
        );
        return result.insertId;
    },

    findAll: async (userId, filters = {}) => {
        const { category, status, search } = filters;
        let query = 'SELECT * FROM company_policies WHERE user_id = ?';
        let queryParams = [userId];

        if (category && category !== 'All') {
            query += ' AND category = ?';
            queryParams.push(category);
        }
        if (status && status !== 'All') {
            query += ' AND status = ?';
            queryParams.push(status);
        }
        if (search) {
            query += ' AND (title LIKE ? OR description LIKE ?)';
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY id DESC';
        const [rows] = await pool.query(query, queryParams);
        return rows;
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM company_policies WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },

    update: async (id, data, userId) => {
        const { title, category, effective_date, review_date, version, description, author, status } = data;
        await pool.query(
            `UPDATE company_policies SET 
            title = ?, category = ?, effective_date = ?, review_date = ?, 
            version = ?, description = ?, author = ?, status = ? 
            WHERE id = ? AND user_id = ?`,
            [title, category, effective_date, review_date, version, description, author, status || 'Active', id, userId]
        );
    },

    delete: async (id, userId) => {
        await pool.query('DELETE FROM company_policies WHERE id = ? AND user_id = ?', [id, userId]);
    }
};

module.exports = CompanyPolicy;
