const { pool } = require('../config/db');

class Visitor {
    static async create(data, userId) {
        const {
            visitor_name, phone_number, email, company_name, visitor_type,
            purpose, host_employee_ids, visit_date, check_in_time,
            id_proof_type, id_proof_number, remarks, send_reminder
        } = data;

        const [result] = await pool.query(
            `INSERT INTO visitors (
                visitor_name, phone_number, email, company_name, visitor_type,
                purpose, host_employee_ids, visit_date, check_in_time,
                id_proof_type, id_proof_number, remarks, send_reminder, user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                visitor_name, phone_number, email || null, company_name || null, visitor_type || 'Client',
                purpose || null, JSON.stringify(host_employee_ids || []), visit_date || null, check_in_time || null,
                id_proof_type || null, id_proof_number || null, remarks || null, send_reminder ? 1 : 0, userId
            ]
        );
        return { id: result.insertId, ...data };
    }

    static async getAll(userId, query = {}) {
        const { status, guest_type } = query;
        let sql = 'SELECT * FROM visitors WHERE user_id = ?';
        const params = [userId];

        if (status && status !== 'All') {
            sql += ' AND status = ?';
            params.push(status);
        }

        if (guest_type && guest_type !== 'All') {
            sql += ' AND visitor_type = ?';
            params.push(guest_type);
        }

        sql += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(sql, params);
        return rows;
    }

    static async getById(id, userId) {
        const [rows] = await pool.query('SELECT * FROM visitors WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    }

    static async update(id, data, userId) {
        const {
            visitor_name, phone_number, email, company_name, visitor_type,
            purpose, host_employee_ids, visit_date, check_in_time, check_out_time,
            status, id_proof_type, id_proof_number, remarks, send_reminder
        } = data;

        await pool.query(
            `UPDATE visitors SET 
                visitor_name = ?, phone_number = ?, email = ?, company_name = ?, visitor_type = ?,
                purpose = ?, host_employee_ids = ?, visit_date = ?, check_in_time = ?, check_out_time = ?,
                status = ?, id_proof_type = ?, id_proof_number = ?, remarks = ?, send_reminder = ?
            WHERE id = ? AND user_id = ?`,
            [
                visitor_name, phone_number, email || null, company_name || null, visitor_type || 'Client',
                purpose || null, JSON.stringify(host_employee_ids || []), visit_date || null, check_in_time || null, check_out_time || null,
                status || 'Waiting', id_proof_type || null, id_proof_number || null, remarks || null, send_reminder ? 1 : 0,
                id, userId
            ]
        );
        return { id, ...data };
    }

    static async delete(id, userId) {
        await pool.query('DELETE FROM visitors WHERE id = ? AND user_id = ?', [id, userId]);
        return { id };
    }

    static async getDueVisitors(userId) {
        // Fetch visitors where userId is in host_employee_ids and visit_date is today
        // and check_in_time was in the last 10 minutes
        const [rows] = await pool.query(
            `SELECT * FROM visitors 
             WHERE visit_date = CURRENT_DATE()
             AND JSON_CONTAINS(host_employee_ids, ?)
             AND status = 'Waiting'
             AND created_at >= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
             ORDER BY created_at DESC`,
            [JSON.stringify(userId)]
        );
        return rows;
    }
}

module.exports = Visitor;
