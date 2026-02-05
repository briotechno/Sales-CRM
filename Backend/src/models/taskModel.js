const { pool } = require('../config/db');

const Task = {
    create: async (data, userId) => {
        const { title, priority, due_date, due_time, category, status } = data;
        const [result] = await pool.query(
            'INSERT INTO tasks (user_id, title, priority, due_date, due_time, category, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, title, priority || 'medium', due_date, due_time, category || 'General', status || 'Pending']
        );
        return result.insertId;
    },

    findAll: async (userId, filters = {}) => {
        const { priority, category, search, timeframe, dateFrom, dateTo, status, page = 1, limit = 10 } = filters;
        let query = 'SELECT * FROM tasks WHERE user_id = ?';
        let queryParams = [userId];

        if (priority && priority !== 'all') {
            query += ' AND priority = ?';
            queryParams.push(priority);
        }

        if (category && category !== 'All') {
            query += ' AND category = ?';
            queryParams.push(category);
        }

        if (status && status !== 'All') {
            query += ' AND status = ?';
            queryParams.push(status);
        }

        if (search) {
            const searchPattern = `%${search}%`;
            query += ' AND title LIKE ?';
            queryParams.push(searchPattern);
        }

        // Custom Date Range
        if (dateFrom) {
            query += ' AND due_date >= ?';
            queryParams.push(dateFrom);
        }
        if (dateTo) {
            query += ' AND due_date <= ?';
            queryParams.push(dateTo);
        }

        // Timeframe filtering (only if dateFrom/dateTo not provided)
        if (!dateFrom && !dateTo && timeframe && timeframe !== 'All') {
            const now = new Date();
            const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

            if (timeframe === 'Today') {
                query += ' AND due_date = ?';
                queryParams.push(today);
            } else if (timeframe === 'Yesterday') {
                const yesterdayDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterday = yesterdayDate.toISOString().split('T')[0];
                query += ' AND due_date = ?';
                queryParams.push(yesterday);
            } else if (timeframe === 'Last 7 Days') {
                const sevenDaysAgoDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
                sevenDaysAgoDate.setDate(sevenDaysAgoDate.getDate() - 7);
                const sevenDaysAgo = sevenDaysAgoDate.toISOString().split('T')[0];
                query += ' AND due_date >= ? AND due_date <= ?';
                queryParams.push(sevenDaysAgo, today);
            } else if (timeframe === 'This Month') {
                const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const firstDayStr = new Date(firstDayOfMonth.getTime() - (firstDayOfMonth.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                query += ' AND due_date >= ? AND due_date <= ?';
                queryParams.push(firstDayStr, today);
            }
        }

        query += ' ORDER BY completed ASC, id DESC';

        const offset = (parseInt(page) - 1) * parseInt(limit);
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const [rows] = await pool.query(query, queryParams);
        return rows;
    },

    getSummary: async (userId, filters = {}) => {
        const { priority, category, search, timeframe, dateFrom, dateTo, status } = filters;
        let query = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as highPriority,
                SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
            FROM tasks WHERE user_id = ?`;
        let queryParams = [userId];

        if (priority && priority !== 'all') {
            query += ' AND priority = ?';
            queryParams.push(priority);
        }

        if (category && category !== 'All') {
            query += ' AND category = ?';
            queryParams.push(category);
        }

        if (status && status !== 'All') {
            query += ' AND status = ?';
            queryParams.push(status);
        }

        if (search) {
            const searchPattern = `%${search}%`;
            query += ' AND title LIKE ?';
            queryParams.push(searchPattern);
        }

        // Custom Date Range
        if (dateFrom) {
            query += ' AND due_date >= ?';
            queryParams.push(dateFrom);
        }
        if (dateTo) {
            query += ' AND due_date <= ?';
            queryParams.push(dateTo);
        }

        // Timeframe filtering
        if (!dateFrom && !dateTo && timeframe && timeframe !== 'All') {
            const now = new Date();
            const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

            if (timeframe === 'Today') {
                query += ' AND due_date = ?';
                queryParams.push(today);
            } else if (timeframe === 'Yesterday') {
                const yesterdayDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterday = yesterdayDate.toISOString().split('T')[0];
                query += ' AND due_date = ?';
                queryParams.push(yesterday);
            } else if (timeframe === 'Last 7 Days') {
                const sevenDaysAgoDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
                sevenDaysAgoDate.setDate(sevenDaysAgoDate.getDate() - 7);
                const sevenDaysAgo = sevenDaysAgoDate.toISOString().split('T')[0];
                query += ' AND due_date >= ? AND due_date <= ?';
                queryParams.push(sevenDaysAgo, today);
            } else if (timeframe === 'This Month') {
                const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const firstDayStr = new Date(firstDayOfMonth.getTime() - (firstDayOfMonth.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                query += ' AND due_date >= ? AND due_date <= ?';
                queryParams.push(firstDayStr, today);
            }
        }

        const [rows] = await pool.query(query, queryParams);
        return rows[0]; // Returns { total, highPriority, active, completed }
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },

    update: async (id, data, userId) => {
        const { title, priority, due_date, due_time, category, completed, status } = data;

        let updateFields = [];
        let params = [];

        if (title !== undefined) { updateFields.push('title = ?'); params.push(title); }
        if (priority !== undefined) { updateFields.push('priority = ?'); params.push(priority); }
        if (due_date !== undefined) { updateFields.push('due_date = ?'); params.push(due_date); }
        if (due_time !== undefined) { updateFields.push('due_time = ?'); params.push(due_time); }
        if (category !== undefined) { updateFields.push('category = ?'); params.push(category); }
        if (completed !== undefined) { updateFields.push('completed = ?'); params.push(completed); }
        if (status !== undefined) { updateFields.push('status = ?'); params.push(status); }

        if (updateFields.length === 0) return false;

        params.push(id, userId);
        const [result] = await pool.query(
            `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
            params
        );
        return result.affectedRows > 0;
    },

    delete: async (id, userId) => {
        const [result] = await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows > 0;
    }
};

module.exports = Task;
