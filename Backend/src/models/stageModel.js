const { pool } = require('../config/db');

const Stage = {
    create: async (data, userId) => {
        const { name, probability, description } = data;
        const [result] = await pool.query(
            'INSERT INTO stages (name, probability, description, user_id) VALUES (?, ?, ?, ?)',
            [name, probability || 0, description, userId]
        );
        return result.insertId;
    },

    findAll: async (userId, page = 1, limit = 10, search = "") => {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM stages WHERE user_id = ?';
        const params = [userId];

        if (search) {
            query += ' AND name LIKE ?';
            params.push(`%${search}%`);
        }

        // Count
        const countQuery = `SELECT COUNT(*) as total FROM stages WHERE user_id = ? ${search ? 'AND name LIKE ?' : ''}`;
        const countParams = search ? [userId, `%${search}%`] : [userId];
        const [countResult] = await pool.query(countQuery, countParams);
        const total = countResult[0].total;

        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [stages] = await pool.query(query, params);

        return {
            stages,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM stages WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },

    update: async (id, data, userId) => {
        const { name, probability, description } = data;
        const [result] = await pool.query(
            'UPDATE stages SET name = ?, probability = ?, description = ? WHERE id = ? AND user_id = ?',
            [name, probability, description, id, userId]
        );
        return result.affectedRows > 0;
    },

    delete: async (id, userId) => {
        const [result] = await pool.query('DELETE FROM stages WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows > 0;
    }
};

module.exports = Stage;
