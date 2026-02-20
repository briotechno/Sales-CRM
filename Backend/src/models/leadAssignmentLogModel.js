const { pool } = require('../config/db');

const LeadAssignmentLog = {
    create: async (data) => {
        const {
            user_id, lead_id, employee_id, assigned_by,
            assignment_type, reassigned_from, reason
        } = data;

        const [result] = await pool.query(
            `INSERT INTO lead_assignment_logs (
                user_id, lead_id, employee_id, assigned_by, 
                assignment_type, reassigned_from, reason
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id, lead_id, employee_id, assigned_by,
                assignment_type, reassigned_from, reason
            ]
        );
        return result.insertId;
    },

    findByLeadId: async (leadId) => {
        const [rows] = await pool.query(
            `SELECT l.*, 
                    COALESCE(e1.employee_name, l.employee_id) as employee_name, 
                    COALESCE(e2.employee_name, l.reassigned_from) as reassigned_from_name
             FROM lead_assignment_logs l
             LEFT JOIN employees e1 ON (l.employee_id = CAST(e1.id AS CHAR) OR l.employee_id = e1.employee_id)
             LEFT JOIN employees e2 ON (l.reassigned_from = CAST(e2.id AS CHAR) OR l.reassigned_from = e2.employee_id)
             WHERE l.lead_id = ?
             ORDER BY l.created_at ASC`,
            [leadId]
        );
        return rows;
    },

    findAll: async (userId, page = 1, limit = 10) => {
        const offset = (page - 1) * limit;
        const [rows] = await pool.query(
            `SELECT l.*, e.employee_name, ld.name as lead_name, ld.lead_id as lead_uid
             FROM lead_assignment_logs l
             LEFT JOIN employees e ON l.employee_id = e.id
             LEFT JOIN leads ld ON l.lead_id = ld.id
             WHERE l.user_id = ?
             ORDER BY l.id DESC LIMIT ? OFFSET ?`,
            [userId, parseInt(limit), parseInt(offset)]
        );

        const [totalRows] = await pool.query(
            'SELECT COUNT(*) as total FROM lead_assignment_logs WHERE user_id = ?',
            [userId]
        );

        return {
            logs: rows,
            pagination: {
                total: totalRows[0].total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalRows[0].total / limit)
            }
        };
    }
};

module.exports = LeadAssignmentLog;
