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

    findAll: async (userId) => {
        const [rows] = await pool.query('SELECT * FROM stages WHERE user_id = ? ORDER BY id DESC', [userId]);
        return rows;
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
