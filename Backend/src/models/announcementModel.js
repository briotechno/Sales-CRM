const { pool } = require('../config/db');

const Announcement = {
    create: async (data, userId) => {
        const { title, content, author, category, date } = data;

        const [result] = await pool.query(
            'INSERT INTO announcements (title, content, author, category, date, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, content, author, category, date, userId]
        );
        return result.insertId;
    },

    findAll: async (userId, page = 1, limit = 10, category = 'All', search = '') => {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM announcements WHERE user_id = ?';
        let countQuery = 'SELECT COUNT(*) as total FROM announcements WHERE user_id = ?';
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
            query += ' AND (title LIKE ? OR content LIKE ? OR author LIKE ?)';
            countQuery += ' AND (title LIKE ? OR content LIKE ? OR author LIKE ?)';
            queryParams.push(searchPattern, searchPattern, searchPattern);
            countParams.push(searchPattern, searchPattern, searchPattern);
        }

        query += ' ORDER BY date DESC, id DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), parseInt(offset));

        const [totalRows] = await pool.query(countQuery, countParams);
        const total = totalRows[0].total;

        const [rows] = await pool.query(query, queryParams);

        return {
            announcements: rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM announcements WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },

    update: async (id, data, userId) => {
        const { title, content, author, category, date } = data;
        const [result] = await pool.query(
            'UPDATE announcements SET title = ?, content = ?, author = ?, category = ?, date = ? WHERE id = ? AND user_id = ?',
            [title, content, author, category, date, id, userId]
        );
        return result.affectedRows > 0;
    },

    delete: async (id, userId) => {
        const [result] = await pool.query('DELETE FROM announcements WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows > 0;
    }
};

module.exports = Announcement;
