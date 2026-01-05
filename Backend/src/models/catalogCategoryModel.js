const { pool } = require('../config/db');

const CatalogCategory = {
    create: async (data, userId) => {
        const { name, status } = data;

        // Check if category name already exists for this user
        const [existing] = await pool.query('SELECT id FROM catalog_categories WHERE name = ? AND user_id = ?', [name, userId]);
        if (existing.length > 0) {
            throw new Error('Category with this name already exists');
        }

        const [result] = await pool.query(
            'INSERT INTO catalog_categories (name, status, user_id) VALUES (?, ?, ?)',
            [name, status || 'Active', userId]
        );
        return result.insertId;
    },

    findAll: async (userId, page = 1, limit = 10, status = null, search = '') => {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM catalog_categories WHERE user_id = ?';
        let countQuery = 'SELECT COUNT(*) as total FROM catalog_categories WHERE user_id = ?';
        let queryParams = [userId];
        let countParams = [userId];

        if (status && status !== 'All') {
            query += ' AND status = ?';
            countQuery += ' AND status = ?';
            queryParams.push(status);
            countParams.push(status);
        }

        if (search) {
            const searchPattern = `%${search}%`;
            query += ' AND name LIKE ?';
            countQuery += ' AND name LIKE ?';
            queryParams.push(searchPattern);
            countParams.push(searchPattern);
        }

        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), parseInt(offset));

        const [totalRows] = await pool.query(countQuery, countParams);
        const total = totalRows[0].total;

        const [rows] = await pool.query(query, queryParams);

        return {
            categories: rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM catalog_categories WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },

    update: async (id, data, userId) => {
        const { name, status } = data;
        const [result] = await pool.query(
            'UPDATE catalog_categories SET name = ?, status = ? WHERE id = ? AND user_id = ?',
            [name, status, id, userId]
        );
        return result.affectedRows > 0;
    },

    delete: async (id, userId) => {
        const [result] = await pool.query('DELETE FROM catalog_categories WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows > 0;
    }
};

module.exports = CatalogCategory;
