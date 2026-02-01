const { pool } = require('../config/db');

const Task = {
    create: async (data, userId) => {
        const { title, priority, due_date, due_time, category } = data;
        const [result] = await pool.query(
            'INSERT INTO tasks (user_id, title, priority, due_date, due_time, category) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, title, priority || 'medium', due_date, due_time, category || 'General']
        );
        return result.insertId;
    },

    findAll: async (userId, filters = {}) => {
        const { priority, category, search, timeframe, dateFrom, dateTo } = filters;
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

        query += ' ORDER BY due_date ASC, due_time ASC';

        const [rows] = await pool.query(query, queryParams);
        return rows;
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },

    update: async (id, data, userId) => {
        const { title, priority, due_date, due_time, category, completed } = data;

        let updateFields = [];
        let params = [];

        if (title !== undefined) { updateFields.push('title = ?'); params.push(title); }
        if (priority !== undefined) { updateFields.push('priority = ?'); params.push(priority); }
        if (due_date !== undefined) { updateFields.push('due_date = ?'); params.push(due_date); }
        if (due_time !== undefined) { updateFields.push('due_time = ?'); params.push(due_time); }
        if (category !== undefined) { updateFields.push('category = ?'); params.push(category); }
        if (completed !== undefined) { updateFields.push('completed = ?'); params.push(completed); }

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
