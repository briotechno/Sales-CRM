const { pool } = require('../config/db');

const LeaveType = {
    create: async (data, userId) => {
        const {
            leave_type, description, renewal_type, leave_allocation,
            max_consecutive_days, eligibility_days, paid, status
        } = data;
        const [result] = await pool.query(
            `INSERT INTO leave_types (
                leave_type, description, renewal_type, leave_allocation,
                max_consecutive_days, eligibility_days, paid, status, user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [leave_type, description, renewal_type, leave_allocation, max_consecutive_days, eligibility_days, paid, status, userId]
        );
        return result.insertId;
    },
    findAll: async (userId, filters = {}, pagination = {}) => {
        const { search, status } = filters;
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM leave_types WHERE user_id = ?';
        let countQuery = 'SELECT COUNT(*) as total FROM leave_types WHERE user_id = ?';
        let queryParams = [userId];

        if (search) {
            query += ' AND (leave_type LIKE ? OR description LIKE ?)';
            countQuery += ' AND (leave_type LIKE ? OR description LIKE ?)';
            queryParams.push(`%${search}%`, `%${search}%`);
        }
        if (status && status !== 'All') {
            query += ' AND status = ?';
            countQuery += ' AND status = ?';
            queryParams.push(status);
        }

        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';

        // Execute count query
        const [countResult] = await pool.query(countQuery, queryParams);
        const total = countResult[0].total;

        // Execute data query
        const [rows] = await pool.query(query, [...queryParams, parseInt(limit), parseInt(offset)]);

        return {
            leave_types: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },
    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM leave_types WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },
    update: async (id, data, userId) => {
        const fields = Object.keys(data).filter(key => key !== 'id' && key !== 'user_id');
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = fields.map(field => data[field]);
        if (fields.length === 0) return;
        await pool.query(
            `UPDATE leave_types SET ${setClause} WHERE id = ? AND user_id = ?`,
            [...values, id, userId]
        );
    },
    delete: async (id, userId) => {
        await pool.query('DELETE FROM leave_types WHERE id = ? AND user_id = ?', [id, userId]);
    }
};

const Holiday = {
    create: async (data, userId) => {
        const { name, start_date, end_date, days } = data;
        const [result] = await pool.query(
            `INSERT INTO holidays (name, start_date, end_date, days, user_id) VALUES (?, ?, ?, ?, ?)`,
            [name, start_date, end_date, days, userId]
        );
        return result.insertId;
    },
    findAll: async (userId, filters = {}, pagination = {}) => {
        const { search } = filters;
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM holidays WHERE user_id = ?';
        let countQuery = 'SELECT COUNT(*) as total FROM holidays WHERE user_id = ?';
        let queryParams = [userId];

        if (search) {
            query += ' AND name LIKE ?';
            countQuery += ' AND name LIKE ?';
            queryParams.push(`%${search}%`);
        }

        query += ' ORDER BY start_date ASC LIMIT ? OFFSET ?';

        const [countResult] = await pool.query(countQuery, queryParams);
        const total = countResult[0].total;

        const [rows] = await pool.query(query, [...queryParams, parseInt(limit), parseInt(offset)]);

        return {
            holidays: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },
    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM holidays WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },
    update: async (id, data, userId) => {
        const fields = Object.keys(data).filter(key => key !== 'id' && key !== 'user_id');
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = fields.map(field => data[field]);
        if (fields.length === 0) return;
        await pool.query(
            `UPDATE holidays SET ${setClause} WHERE id = ? AND user_id = ?`,
            [...values, id, userId]
        );
    },
    delete: async (id, userId) => {
        await pool.query('DELETE FROM holidays WHERE id = ? AND user_id = ?', [id, userId]);
    }
};

const LeaveRequest = {
    create: async (data, userId) => {
        const { employee_id, leave_type_id, from_date, to_date, days, reason, status } = data;
        const [result] = await pool.query(
            `INSERT INTO leave_requests (
                employee_id, leave_type_id, from_date, to_date, days, reason, status, user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [employee_id, leave_type_id, from_date, to_date, days, reason, status || 'pending', userId]
        );
        return result.insertId;
    },
    findAll: async (userId, filters = {}, pagination = {}) => {
        const { status, search } = filters;
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        let query = `
            SELECT lr.*, e.employee_name, e.employee_id as employee_uid, lt.leave_type
            FROM leave_requests lr
            LEFT JOIN employees e ON lr.employee_id = e.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.user_id = ?
        `;
        let countQuery = `
            SELECT COUNT(*) as total
            FROM leave_requests lr
            LEFT JOIN employees e ON lr.employee_id = e.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.user_id = ?
        `;
        let queryParams = [userId];

        if (status && status !== 'All' && status !== 'all') {
            query += ' AND lr.status = ?';
            countQuery += ' AND lr.status = ?';
            queryParams.push(status);
        }

        if (search) {
            query += ' AND (e.employee_name LIKE ? OR lt.leave_type LIKE ?)';
            countQuery += ' AND (e.employee_name LIKE ? OR lt.leave_type LIKE ?)';
            const searchPattern = `%${search}%`;
            queryParams.push(searchPattern, searchPattern);
        }

        query += ' ORDER BY lr.id DESC LIMIT ? OFFSET ?';

        const [countResult] = await pool.query(countQuery, queryParams);
        const total = countResult[0].total;

        const [rows] = await pool.query(query, [...queryParams, parseInt(limit), parseInt(offset)]);

        return {
            leave_requests: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },
    findById: async (id, userId) => {
        const [rows] = await pool.query(`
            SELECT lr.*, e.employee_name, lt.leave_type
            FROM leave_requests lr
            LEFT JOIN employees e ON lr.employee_id = e.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.id = ? AND lr.user_id = ?
        `, [id, userId]);
        return rows[0];
    },
    updateStatus: async (id, status, userId) => {
        await pool.query('UPDATE leave_requests SET status = ? WHERE id = ? AND user_id = ?', [status, id, userId]);
    },
    delete: async (id, userId) => {
        await pool.query('DELETE FROM leave_requests WHERE id = ? AND user_id = ?', [id, userId]);
    }
};

module.exports = { LeaveType, Holiday, LeaveRequest };
