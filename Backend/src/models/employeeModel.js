const { pool } = require('../config/db');

const Employee = {
    create: async (data) => {
        const {
            first_name,
            last_name,
            email,
            mobile_number,
            department_id,
            designation_id,
            gender,
            date_of_joining,
            profile_image,
            status
        } = data;

        // Generate unique employee_id
        const [rows] = await pool.query('SELECT employee_id FROM employees ORDER BY id DESC LIMIT 1');
        let newId = 'EMP001';
        if (rows.length > 0 && rows[0].employee_id) {
            const lastId = rows[0].employee_id;
            const numericPart = parseInt(lastId.substring(3)); // Extract number after 'EMP'
            const nextNum = numericPart + 1;
            newId = `EMP${String(nextNum).padStart(3, '0')}`;
        }

        const [result] = await pool.query(
            `INSERT INTO employees (
                employee_id, first_name, last_name, email, mobile_number, 
                department_id, designation_id, gender, date_of_joining, 
                profile_image, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                newId, first_name, last_name, email, mobile_number,
                department_id, designation_id, gender, date_of_joining,
                profile_image, status
            ]
        );
        return result.insertId;
    },

    findAll: async (page = 1, limit = 10) => {
        const offset = (page - 1) * limit;

        // Get total count
        const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM employees');
        const total = totalRows[0].total;

        const [rows] = await pool.query(`
            SELECT e.*, 
            d.department_name, d.department_id as department_uid,
            deg.designation_name, deg.designation_id as designation_uid
            FROM employees e 
            LEFT JOIN departments d ON e.department_id = d.id 
            LEFT JOIN designations deg ON e.designation_id = deg.id
            ORDER BY e.id DESC
            LIMIT ? OFFSET ?
        `, [parseInt(limit), parseInt(offset)]);

        return {
            employees: rows,
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
            SELECT e.*, 
            d.department_name, d.department_id as department_uid,
            deg.designation_name, deg.designation_id as designation_uid
            FROM employees e 
            LEFT JOIN departments d ON e.department_id = d.id 
            LEFT JOIN designations deg ON e.designation_id = deg.id
            WHERE e.id = ?
        `, [id]);
        return rows[0];
    },

    update: async (id, data) => {
        const {
            first_name,
            last_name,
            email,
            mobile_number,
            department_id,
            designation_id,
            gender,
            date_of_joining,
            profile_image,
            status
        } = data;

        await pool.query(
            `UPDATE employees SET 
                first_name = ?, last_name = ?, email = ?, 
                mobile_number = ?, department_id = ?, designation_id = ?, 
                gender = ?, date_of_joining = ?, profile_image = ?, status = ? 
            WHERE id = ?`,
            [
                first_name, last_name, email, mobile_number,
                department_id, designation_id, gender, date_of_joining,
                profile_image, status, id
            ]
        );
    },

    delete: async (id) => {
        await pool.query('DELETE FROM employees WHERE id = ?', [id]);
    }
};

module.exports = Employee;
