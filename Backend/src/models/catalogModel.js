const { pool } = require('../config/db');

const Catalog = {
    create: async (data, userId) => {
        const {
            name, category, vendor, description, minPrice, maxPrice,
            status, image, images, features, specifications,
            deliveryTime
        } = data;

        // Generate unique catalog_id
        const [rows] = await pool.query('SELECT catalog_id FROM catalogs ORDER BY id DESC LIMIT 1');
        let newId = 'CAT001';
        if (rows.length > 0 && rows[0].catalog_id) {
            const lastId = rows[0].catalog_id;
            const numericPart = parseInt(lastId.substring(3));
            const nextNum = numericPart + 1;
            newId = `CAT${String(nextNum).padStart(3, '0')}`;
        }

        const [result] = await pool.query(
            `INSERT INTO catalogs (
                catalog_id, name, category, vendor, description, minPrice, maxPrice, 
                status, image, images, features, specifications, 
                deliveryTime, user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                newId, name, category, vendor, description, minPrice, maxPrice,
                status || 'Active', image, JSON.stringify(images || []),
                JSON.stringify(features || []), JSON.stringify(specifications || {}),
                deliveryTime, userId
            ]
        );
        return result.insertId;
    },

    findAll: async (userId, page = 1, limit = 10, status = null, search = '') => {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM catalogs WHERE user_id = ?';
        let countQuery = 'SELECT COUNT(*) as total FROM catalogs WHERE user_id = ?';
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
            query += ' AND (name LIKE ? OR catalog_id LIKE ?)';
            countQuery += ' AND (name LIKE ? OR catalog_id LIKE ?)';
            queryParams.push(searchPattern, searchPattern);
            countParams.push(searchPattern, searchPattern);
        }

        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), parseInt(offset));

        const [totalRows] = await pool.query(countQuery, countParams);
        const total = totalRows[0].total;

        const [rows] = await pool.query(query, queryParams);

        // Parse JSON fields
        const catalogs = rows.map(row => ({
            ...row,
            images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features,
            specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : row.specifications
        }));

        return {
            catalogs,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM catalogs WHERE (id = ? OR catalog_id = ?) AND user_id = ?', [id, id, userId]);
        if (rows.length === 0) return null;

        const row = rows[0];
        return {
            ...row,
            images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
            features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
            specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : (row.specifications || {})
        };
    },

    update: async (id, data, userId) => {
        const {
            name, category, vendor, description, minPrice, maxPrice,
            status, image, images, features, specifications,
            deliveryTime
        } = data;

        const [result] = await pool.query(
            `UPDATE catalogs SET 
                name = ?, category = ?, vendor = ?, description = ?, minPrice = ?, maxPrice = ?, 
                status = ?, image = ?, images = ?, features = ?, specifications = ?, 
                deliveryTime = ?
            WHERE id = ? AND user_id = ?`,
            [
                name, category, vendor, description, minPrice, maxPrice,
                status, image, JSON.stringify(images),
                JSON.stringify(features), JSON.stringify(specifications),
                deliveryTime, id, userId
            ]
        );
        return result.affectedRows > 0;
    },

    delete: async (id, userId) => {
        const [result] = await pool.query('DELETE FROM catalogs WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows > 0;
    }
};

module.exports = Catalog;
