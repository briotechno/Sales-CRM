const { pool } = require('../config/db');

const Department = {
    create: async (data) => {
        const { department_name, icon, status } = data;

        // Check if department name already exists
        const [existing] = await pool.query('SELECT id FROM departments WHERE department_name = ?', [department_name]);
        if (existing.length > 0) {
            throw new Error('Department with this name already exists');
        }

        // Generate unique department_id
        const [rows] = await pool.query('SELECT department_id FROM departments ORDER BY id DESC LIMIT 1');
        let newId = 'DEP001';
        if (rows.length > 0 && rows[0].department_id) {
            const lastId = rows[0].department_id;
            const numericPart = parseInt(lastId.substring(3)); // Extract number after 'DEP'
            const nextNum = numericPart + 1;
            newId = `DEP${String(nextNum).padStart(3, '0')}`;
        }

        const [result] = await pool.query(
            'INSERT INTO departments (department_id, department_name, icon, status) VALUES (?, ?, ?, ?)',
            [newId, department_name, icon, status]
        );
        return result.insertId;
    },

    findAll: async () => {
        const [rows] = await pool.query(`
            SELECT d.*, 
            (SELECT COUNT(*) FROM employees e WHERE e.department_id = d.id) as employee_count,
            (SELECT COUNT(*) FROM designations deg WHERE deg.department_id = d.id) as designation_count
            FROM departments d
        `);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await pool.query(`
            SELECT d.*, 
            (SELECT COUNT(*) FROM employees e WHERE e.department_id = d.id) as employee_count,
            (SELECT COUNT(*) FROM designations deg WHERE deg.department_id = d.id) as designation_count
            FROM departments d
            WHERE d.id = ?
        `, [id]);
        return rows[0];
    },

    update: async (id, data) => {
        const { department_name, icon, status } = data;
        await pool.query(
            'UPDATE departments SET department_name = ?, icon = ?, status = ? WHERE id = ?',
            [department_name, icon, status, id]
        );
    },

    delete: async (id) => {
        await pool.query('DELETE FROM departments WHERE id = ?', [id]);
    }
};

module.exports = Department;
