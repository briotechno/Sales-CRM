const { pool } = require('../config/db');

const Terms = {
    create: async (data, userId) => {
        const { department, designation, title, description } = data;
        const [result] = await pool.query(
            'INSERT INTO hr_terms (department, designation, title, description, user_id) VALUES (?, ?, ?, ?, ?)',
            [department, designation, title, description, userId]
        );
        return result.insertId;
    },

    findAll: async (userId, filters = {}) => {
        const { department, designation, search } = filters;
        let query = 'SELECT * FROM hr_terms WHERE user_id = ?';
        let queryParams = [userId];

        if (department) {
            query += ' AND department = ?';
            queryParams.push(department);
        }
        if (designation) {
            query += ' AND designation = ?';
            queryParams.push(designation);
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
        const [rows] = await pool.query('SELECT * FROM hr_terms WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },

    update: async (id, data, userId) => {
        const { department, designation, title, description } = data;
        await pool.query(
            'UPDATE hr_terms SET department = ?, designation = ?, title = ?, description = ? WHERE id = ? AND user_id = ?',
            [department, designation, title, description, id, userId]
        );
    },

    delete: async (id, userId) => {
        await pool.query('DELETE FROM hr_terms WHERE id = ? AND user_id = ?', [id, userId]);
    }
};

module.exports = Terms;
