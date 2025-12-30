const { pool } = require('../config/db');

const Employee = {
    create: async (data) => {
        const {
            employee_name, profile_picture, date_of_birth, age, gender,
            father_name, mother_name, marital_status, joining_date,
            department_id, designation_id, employee_type, work_type,
            mobile_number, alternate_mobile_number, email,
            permanent_address, correspondence_address,
            emergency_contact_person, emergency_contact_number,
            blood_group, languages, aadhar_number, pan_number,
            aadhar_front, aadhar_back, pan_card,
            ifsc_code, account_number, account_holder_name, branch_name,
            cancelled_cheque, username, password, status
        } = data;

        // Generate unique employee_id
        const [rows] = await pool.query('SELECT employee_id FROM employees ORDER BY id DESC LIMIT 1');
        let newId = 'EMP10001';
        if (rows.length > 0 && rows[0].employee_id) {
            const lastId = rows[0].employee_id;
            const numericPart = parseInt(lastId.substring(3));
            const nextNum = numericPart + 1;
            newId = `EMP${nextNum}`;
        }

        const [result] = await pool.query(
            `INSERT INTO employees (
                employee_id, employee_name, profile_picture, date_of_birth, age, gender,
                father_name, mother_name, marital_status, joining_date,
                department_id, designation_id, employee_type, work_type,
                mobile_number, alternate_mobile_number, email,
                permanent_address, correspondence_address,
                emergency_contact_person, emergency_contact_number,
                blood_group, languages, aadhar_number, pan_number,
                aadhar_front, aadhar_back, pan_card,
                ifsc_code, account_number, account_holder_name, branch_name,
                cancelled_cheque, username, password, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                newId, employee_name, profile_picture, date_of_birth, age, gender,
                father_name, mother_name, marital_status, joining_date,
                department_id, designation_id, employee_type, work_type,
                mobile_number, alternate_mobile_number, email,
                permanent_address, correspondence_address,
                emergency_contact_person, emergency_contact_number,
                blood_group, languages, aadhar_number, pan_number,
                aadhar_front, aadhar_back, pan_card,
                ifsc_code, account_number, account_holder_name, branch_name,
                cancelled_cheque, username, password, status
            ]
        );
        return result.insertId;
    },

    findAll: async (page = 1, limit = 10, status = 'All', search = '') => {
        const offset = (page - 1) * limit;
        let query = `
            SELECT e.*, 
            d.department_name, d.department_id as department_uid,
            deg.designation_name, deg.designation_id as designation_uid
            FROM employees e 
            LEFT JOIN departments d ON e.department_id = d.id 
            LEFT JOIN designations deg ON e.designation_id = deg.id
            WHERE 1=1
        `;
        let countQuery = 'SELECT COUNT(*) as total FROM employees e WHERE 1=1';
        let queryParams = [];

        if (status !== 'All') {
            query += ' AND e.status = ?';
            countQuery += ' AND status = ?';
            queryParams.push(status);
        }

        if (search) {
            const searchPattern = `%${search}%`;
            query += ' AND (e.employee_name LIKE ? OR e.employee_id LIKE ? OR e.email LIKE ? OR e.mobile_number LIKE ?)';
            countQuery += ' AND (employee_name LIKE ? OR employee_id LIKE ? OR email LIKE ? OR mobile_number LIKE ?)';
            queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }

        query += ' ORDER BY e.id DESC LIMIT ? OFFSET ?';
        let countParams = queryParams.slice(0, status !== 'All' ? 1 : 0);
        if (search) {
            countParams = [...countParams, ...Array(4).fill(`%${search}%`)];
        }

        queryParams.push(parseInt(limit), parseInt(offset));

        const [totalRows] = await pool.query(countQuery, countParams);
        const total = totalRows[0].total;

        const [rows] = await pool.query(query, queryParams);

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
        const fields = Object.keys(data).filter(key => key !== 'id' && key !== 'employee_id');
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = fields.map(field => data[field]);

        if (fields.length === 0) return;

        await pool.query(
            `UPDATE employees SET ${setClause} WHERE id = ?`,
            [...values, id]
        );
    },

    delete: async (id) => {
        await pool.query('DELETE FROM employees WHERE id = ?', [id]);
    }
};

module.exports = Employee;
