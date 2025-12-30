const { pool } = require('../config/db');

const Designation = {
    create: async (data) => {
        const { department_id, designation_name, image, status } = data;

        // Generate unique designation_id
        const [rows] = await pool.query('SELECT designation_id FROM designations ORDER BY id DESC LIMIT 1');
        let newId = 'DSG001';
        if (rows.length > 0 && rows[0].designation_id) {
            const lastId = rows[0].designation_id;
            const numericPart = parseInt(lastId.substring(3)); // Extract number after 'DSG'
            const nextNum = numericPart + 1;
            newId = `DSG${String(nextNum).padStart(3, '0')}`;
        }

        const [result] = await pool.query(
            'INSERT INTO designations (designation_id, department_id, designation_name, image, status) VALUES (?, ?, ?, ?, ?)',
            [newId, department_id, designation_name, image, status]
        );
        return result.insertId;
    },

    findAll: async (page = 1, limit = 10, status = 'All', search = '') => {
        const offset = (page - 1) * limit;
        let query = `
            SELECT deg.*, d.department_name, d.department_id as department_uid,
            (SELECT COUNT(*) FROM employees e WHERE e.designation_id = deg.id) as employee_count
            FROM designations deg
            LEFT JOIN departments d ON deg.department_id = d.id
            WHERE 1=1
        `;
        let countQuery = 'SELECT COUNT(*) as total FROM designations deg LEFT JOIN departments d ON deg.department_id = d.id WHERE 1=1';
        let queryParams = [];
        let countParams = [];

        if (status && status !== 'All') {
            query += ' AND deg.status = ?';
            countQuery += ' AND deg.status = ?';
            queryParams.push(status);
            countParams.push(status);
        }

        if (search) {
            const searchPattern = `%${search}%`;
            query += ' AND (deg.designation_name LIKE ? OR deg.designation_id LIKE ? OR d.department_name LIKE ?)';
            countQuery += ' AND (deg.designation_name LIKE ? OR deg.designation_id LIKE ? OR d.department_name LIKE ?)';
            queryParams.push(searchPattern, searchPattern, searchPattern);
            countParams.push(searchPattern, searchPattern, searchPattern);
        }

        query += ' ORDER BY deg.id DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), parseInt(offset));

        // Get total count
        const [totalRows] = await pool.query(countQuery, countParams);
        const total = totalRows[0].total;

        const [rows] = await pool.query(query, queryParams);

        return {
            designations: rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    findById: async (id) => {
        const [rows] = await pool.query(`
            SELECT deg.*, d.department_name, d.department_id as department_uid,
            (SELECT COUNT(*) FROM employees e WHERE e.designation_id = deg.id) as employee_count
            FROM designations deg
            LEFT JOIN departments d ON deg.department_id = d.id
            WHERE deg.id = ?
        `, [id]);
        return rows[0];
    },

    update: async (id, data) => {
        const { department_id, designation_name, image, status } = data;
        await pool.query(
            'UPDATE designations SET department_id = ?, designation_name = ?, image = ?, status = ? WHERE id = ?',
            [department_id, designation_name, image, status, id]
        );
    },

    delete: async (id) => {
        await pool.query('DELETE FROM designations WHERE id = ?', [id]);
    }
};

module.exports = Designation;
