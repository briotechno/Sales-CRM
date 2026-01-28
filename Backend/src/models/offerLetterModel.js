const { pool } = require('../config/db');

class OfferLetter {
    static async create(data) {
        const {
            user_id, employee_id, candidate_name, email, phone,
            designation, department, basic_salary, allowances,
            deductions, net_salary, joining_date, offer_date,
            status, address
        } = data;

        const query = `
            INSERT INTO offer_letters (
                user_id, employee_id, candidate_name, email, phone,
                designation, department, basic_salary, allowances,
                deductions, net_salary, joining_date, offer_date,
                status, address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(query, [
            user_id, employee_id, candidate_name, email, phone,
            designation, department, basic_salary,
            JSON.stringify(allowances || []),
            JSON.stringify(deductions || []),
            net_salary, joining_date, offer_date,
            status || 'Draft', address
        ]);

        return result.insertId;
    }

    static async findAll(userId, { page = 1, limit = 10, search = '', status = 'All' }) {
        const offset = (page - 1) * limit;
        let query = `SELECT * FROM offer_letters WHERE user_id = ?`;
        const params = [userId];

        if (status !== 'All') {
            query += ` AND status = ?`;
            params.push(status);
        }

        if (search) {
            query += ` AND (candidate_name LIKE ? OR email LIKE ? OR designation LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;

        query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit.toString(), offset.toString());

        const [rows] = await pool.execute(query, params);

        return {
            offerLetters: rows.map(row => ({
                ...row,
                allowances: typeof row.allowances === 'string' ? JSON.parse(row.allowances) : row.allowances,
                deductions: typeof row.deductions === 'string' ? JSON.parse(row.deductions) : row.deductions
            })),
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    static async findById(id, userId) {
        const query = `SELECT * FROM offer_letters WHERE id = ? AND user_id = ?`;
        const [rows] = await pool.execute(query, [id, userId]);
        if (rows[0]) {
            return {
                ...rows[0],
                allowances: typeof rows[0].allowances === 'string' ? JSON.parse(rows[0].allowances) : rows[0].allowances,
                deductions: typeof rows[0].deductions === 'string' ? JSON.parse(rows[0].deductions) : rows[0].deductions
            };
        }
        return null;
    }

    static async update(id, userId, data) {
        const fields = [];
        const params = [];

        Object.keys(data).forEach(key => {
            if (['candidate_name', 'email', 'phone', 'designation', 'department', 'basic_salary', 'net_salary', 'joining_date', 'offer_date', 'status', 'address'].includes(key)) {
                fields.push(`${key} = ?`);
                params.push(data[key]);
            } else if (['allowances', 'deductions'].includes(key)) {
                fields.push(`${key} = ?`);
                params.push(JSON.stringify(data[key]));
            }
        });

        if (fields.length === 0) return false;

        params.push(id, userId);
        const query = `UPDATE offer_letters SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
        const [result] = await pool.execute(query, params);
        return result.affectedRows > 0;
    }

    static async delete(id, userId) {
        const query = `DELETE FROM offer_letters WHERE id = ? AND user_id = ?`;
        const [result] = await pool.execute(query, [id, userId]);
        return result.affectedRows > 0;
    }
}

module.exports = OfferLetter;
