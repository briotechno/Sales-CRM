const { pool } = require('../config/db');

const ProductKey = {
    create: async (data) => {
        const { product_key, enterprise, plan, status, users, validity, generatedOn, expiresOn } = data;
        const [result] = await pool.query(
            `INSERT INTO product_keys (product_key, enterprise, plan, status, users, validity, generatedOn, expiresOn) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [product_key, enterprise, plan, status || 'Pending', users || 0, validity, generatedOn, expiresOn]
        );
        return result.insertId;
    },

    findAll: async (filters = {}) => {
        let query = 'SELECT * FROM product_keys WHERE 1=1';
        const params = [];

        if (filters.status && filters.status !== 'all') {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.searchTerm) {
            query += ' AND (enterprise LIKE ? OR product_key LIKE ? OR id LIKE ?)';
            const term = `%${filters.searchTerm}%`;
            params.push(term, term, term);
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
        let query = 'SELECT COUNT(*) as total FROM product_keys WHERE 1=1';
        const params = [];

        if (filters.status && filters.status !== 'all') {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.searchTerm) {
            query += ' AND (enterprise LIKE ? OR product_key LIKE ? OR id LIKE ?)';
            const term = `%${filters.searchTerm}%`;
            params.push(term, term, term);
        }

        const [rows] = await pool.query(query, params);
        return rows[0].total;
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM product_keys WHERE id = ?', [id]);
        return rows[0];
    },

    update: async (id, data) => {
        const { enterprise, plan, status, users, validity, expiresOn } = data;
        const [result] = await pool.query(
            `UPDATE product_keys SET 
             enterprise = ?, plan = ?, status = ?, users = ?, validity = ?, expiresOn = ? 
             WHERE id = ?`,
            [enterprise, plan, status, users, validity, expiresOn, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM product_keys WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },

    findByKey: async (productKey) => {
        const [rows] = await pool.query('SELECT * FROM product_keys WHERE product_key = ?', [productKey]);
        return rows[0];
    },

    updateStatusByKey: async (productKey, status, enterpriseId) => {
        const [result] = await pool.query(
            'UPDATE product_keys SET status = ?, enterprise_id = ? WHERE product_key = ?',
            [status, enterpriseId, productKey]
        );
        return result.affectedRows > 0;
    }
};

module.exports = ProductKey;
