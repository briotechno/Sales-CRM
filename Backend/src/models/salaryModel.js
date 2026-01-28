const { pool } = require('../config/db');

class Salary {
    static async create(salaryData) {
        const {
            user_id,
            employee_id,
            designation,
            department,
            basic_salary,
            allowances,
            deductions,
            net_salary,
            status,
            pay_date
        } = salaryData;

        const query = `
      INSERT INTO salaries (
        user_id, employee_id, designation, department, basic_salary, 
        allowances, deductions, net_salary, status, pay_date,
        start_date, end_date, working_days, present_days
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const [result] = await pool.execute(query, [
            user_id, employee_id, designation, department, basic_salary,
            allowances, deductions, net_salary, status, pay_date,
            salaryData.start_date, salaryData.end_date, salaryData.working_days, salaryData.present_days
        ]);

        return result.insertId;
    }

    static async findAll(userId, { page = 1, limit = 10, search = '', department = 'all' }) {
        const offset = (page - 1) * limit;
        let query = `
      SELECT s.*, e.employee_name, e.profile_picture 
      FROM salaries s
      LEFT JOIN employees e ON s.employee_id = e.id
      WHERE s.user_id = ?
    `;
        const params = [userId];

        if (search) {
            query += ` AND (e.employee_name LIKE ? OR s.designation LIKE ? OR s.department LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (department !== 'all') {
            query += ` AND s.department = ?`;
            params.push(department);
        }

        // Count query for pagination
        const countQuery = query.replace('SELECT s.*, e.employee_name, e.profile_picture', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        // Add ordering and pagination
        query += ` ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit.toString(), offset.toString());

        const [rows] = await pool.execute(query, params);

        return {
            salaries: rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages
            }
        };
    }

    static async findById(id, userId) {
        const query = `
      SELECT s.*, e.employee_name 
      FROM salaries s
      LEFT JOIN employees e ON s.employee_id = e.id
      WHERE s.id = ? AND s.user_id = ?
    `;
        const [rows] = await pool.execute(query, [id, userId]);
        return rows[0];
    }

    static async update(id, userId, salaryData) {
        const {
            basic_salary,
            allowances,
            deductions,
            net_salary,
            status,
            pay_date
        } = salaryData;

        // Build dynamic update query
        let fields = [];
        let params = [];

        if (basic_salary !== undefined) { fields.push('basic_salary = ?'); params.push(basic_salary); }
        if (allowances !== undefined) { fields.push('allowances = ?'); params.push(allowances); }
        if (deductions !== undefined) { fields.push('deductions = ?'); params.push(deductions); }
        if (net_salary !== undefined) { fields.push('net_salary = ?'); params.push(net_salary); }
        if (status !== undefined) { fields.push('status = ?'); params.push(status); }
        if (pay_date !== undefined) { fields.push('pay_date = ?'); params.push(pay_date); }
        if (salaryData.start_date !== undefined) { fields.push('start_date = ?'); params.push(salaryData.start_date); }
        if (salaryData.end_date !== undefined) { fields.push('end_date = ?'); params.push(salaryData.end_date); }
        if (salaryData.working_days !== undefined) { fields.push('working_days = ?'); params.push(salaryData.working_days); }
        if (salaryData.present_days !== undefined) { fields.push('present_days = ?'); params.push(salaryData.present_days); }

        if (fields.length === 0) return false;

        // Add user_id check to WHERE clause
        const query = `UPDATE salaries SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
        params.push(id, userId);

        const [result] = await pool.execute(query, params);
        return result.affectedRows > 0;
    }

    static async delete(id, userId) {
        const query = `DELETE FROM salaries WHERE id = ? AND user_id = ?`;
        const [result] = await pool.execute(query, [id, userId]);
        return result.affectedRows > 0;
    }

    static async getStats(userId) {
        const query = `
      SELECT 
        SUM(CASE WHEN status = 'paid' THEN net_salary ELSE 0 END) as total_paid,
        SUM(CASE WHEN status = 'pending' THEN net_salary ELSE 0 END) as total_pending,
        SUM(net_salary) as total_payroll,
        COUNT(DISTINCT department) as active_departments
      FROM salaries
      WHERE user_id = ?
    `;
        const [rows] = await pool.execute(query, [userId]);
        return rows[0];
    }
}

module.exports = Salary;
