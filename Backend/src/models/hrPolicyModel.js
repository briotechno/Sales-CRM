const { pool } = require('../config/db');

const HRPolicy = {
    create: async (data, userId) => {
        const { title, category, description, effective_date, review_date, version, department, applicable_to, status, document_path } = data;
        const [result] = await pool.query(
            `INSERT INTO hr_policies 
            (title, category, description, effective_date, review_date, version, department, applicable_to, status, document_path, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, category, description, effective_date, review_date, version || '1.0', department, applicable_to || 'all', status || 'Active', document_path, userId]
        );
        return result.insertId;
    },

    findAll: async (userId, filters = {}) => {
        const { category, status, search, department } = filters;
        let query = 'SELECT * FROM hr_policies WHERE user_id = ?';
        let queryParams = [userId];

        if (category && category !== 'all') {
            query += ' AND category = ?';
            queryParams.push(category);
        }
        if (status && status !== 'all') {
            query += ' AND status = ?';
            queryParams.push(status);
        }
        if (department) {
            query += ' AND department = ?';
            queryParams.push(department);
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
        const [rows] = await pool.query('SELECT * FROM hr_policies WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },

    update: async (id, data, userId) => {
        const { title, category, description, effective_date, review_date, version, department, applicable_to, status, document_path } = data;

        let query = `UPDATE hr_policies SET 
            title = ?, category = ?, description = ?, effective_date = ?, review_date = ?, 
            version = ?, department = ?, applicable_to = ?, status = ?`;
        let params = [title, category, description, effective_date, review_date, version, department, applicable_to, status || 'Active'];

        if (document_path) {
            query += ', document_path = ?';
            params.push(document_path);
        }

        query += ' WHERE id = ? AND user_id = ?';
        params.push(id, userId);

        await pool.query(query, params);
    },

    delete: async (id, userId) => {
        await pool.query('DELETE FROM hr_policies WHERE id = ? AND user_id = ?', [id, userId]);
    }
};

module.exports = HRPolicy;
