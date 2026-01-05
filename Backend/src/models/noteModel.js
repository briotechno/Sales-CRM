const { pool } = require('../config/db');

const Note = {
    create: async (data, userId) => {
        const { title, content, category } = data;
        const [result] = await pool.query(
            'INSERT INTO notes (user_id, title, content, category) VALUES (?, ?, ?, ?)',
            [userId, title, content, category || 'General']
        );
        return result.insertId;
    },

    findAll: async (userId, page = 1, limit = 10, category = 'All', search = '') => {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM notes WHERE user_id = ?';
        let countQuery = 'SELECT COUNT(*) as total FROM notes WHERE user_id = ?';
        let queryParams = [userId];
        let countParams = [userId];

        if (category && category !== 'All') {
            query += ' AND category = ?';
            countQuery += ' AND category = ?';
            queryParams.push(category);
            countParams.push(category);
        }

        if (search) {
            const searchPattern = `%${search}%`;
            query += ' AND (title LIKE ? OR content LIKE ?)';
            countQuery += ' AND (title LIKE ? OR content LIKE ?)';
            queryParams.push(searchPattern, searchPattern);
            countParams.push(searchPattern, searchPattern);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), parseInt(offset));

        const [totalRows] = await pool.query(countQuery, countParams);
        const total = totalRows[0].total;

        const [rows] = await pool.query(query, queryParams);

        return {
            notes: rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },

    update: async (id, data, userId) => {
        const { title, content, category } = data;
        const [result] = await pool.query(
            'UPDATE notes SET title = ?, content = ?, category = ? WHERE id = ? AND user_id = ?',
            [title, content, category, id, userId]
        );
        return result.affectedRows > 0;
    },

    delete: async (id, userId) => {
        const [result] = await pool.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows > 0;
    }
};

module.exports = Note;
