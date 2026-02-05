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

    findAll: async (userId, page = 1, limit = 10, category = 'All', search = '', title = '', author = '') => {
        const offset = (page - 1) * limit;
        let query = `
            SELECT a.*, u.profile_picture as author_profile_picture 
            FROM announcements a 
            LEFT JOIN users u ON a.user_id = u.id 
            WHERE a.user_id = ?`;
        let countQuery = 'SELECT COUNT(*) as total FROM announcements WHERE user_id = ?';
        let queryParams = [userId];
        let countParams = [userId];

        if (category && category !== 'All') {
            query += ' AND a.category = ?';
            countQuery += ' AND category = ?';
            queryParams.push(category);
            countParams.push(category);
        }

        if (search) {
            const searchPattern = `%${search}%`;
            query += ' AND (a.title LIKE ? OR a.content LIKE ? OR a.author LIKE ?)';
            countQuery += ' AND (title LIKE ? OR content LIKE ? OR author LIKE ?)';
            queryParams.push(searchPattern, searchPattern, searchPattern);
            countParams.push(searchPattern, searchPattern, searchPattern);
        }

        if (title) {
            const titlePattern = `%${title}%`;
            query += ' AND a.title LIKE ?';
            countQuery += ' AND title LIKE ?';
            queryParams.push(titlePattern);
            countParams.push(titlePattern);
        }

        if (author) {
            const authorPattern = `%${author}%`;
            query += ' AND a.author LIKE ?';
            countQuery += ' AND author LIKE ?';
            queryParams.push(authorPattern);
            countParams.push(authorPattern);
        }

        query += ' ORDER BY a.date DESC, a.id DESC LIMIT ? OFFSET ?';
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
        const [rows] = await pool.query(`
            SELECT a.*, u.profile_picture as author_profile_picture 
            FROM announcements a 
            LEFT JOIN users u ON a.user_id = u.id 
            WHERE a.id = ? AND a.user_id = ?`, [id, userId]);
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
