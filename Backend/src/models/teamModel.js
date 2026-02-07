const { pool } = require('../config/db');

const Team = {
    create: async (data, userId) => {
        const { team_name, description, status, members } = data;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Generate unique team_id (TM001, TM002, etc.) for all users
            const [rows] = await connection.query('SELECT team_id FROM teams ORDER BY id DESC LIMIT 1');
            let newId = 'TM001';
            if (rows.length > 0 && rows[0].team_id) {
                const lastId = rows[0].team_id;
                const numericPart = parseInt(lastId.substring(2)); // Extract number after 'TM'
                const nextNum = numericPart + 1;
                newId = `TM${String(nextNum).padStart(3, '0')}`;
            }

            const [result] = await connection.query(
                'INSERT INTO teams (team_id, team_name, description, status, user_id) VALUES (?, ?, ?, ?, ?)',
                [newId, team_name, description, status || 'Active', userId]
            );

            const teamTableId = result.insertId;

            // Add members if provided
            if (members && Array.isArray(members)) {
                for (const member of members) {
                    await connection.query(
                        'INSERT INTO team_members (team_id, employee_id, level) VALUES (?, ?, ?)',
                        [teamTableId, member.employee_id, member.level || 1]
                    );
                }
            }

            await connection.commit();
            return teamTableId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    findAll: async (userId, page = 1, limit = 10, search = '', status = '', departmentId = '', designationId = '', employeeId = '', dateFrom = '', dateTo = '') => {
        const offset = (page - 1) * limit;

        let conditions = ['t.user_id = ?'];
        const queryParams = [userId];

        if (search) {
            conditions.push('(t.team_name LIKE ? OR t.description LIKE ? OR t.team_id LIKE ?)');
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (status) {
            conditions.push('t.status = ?');
            queryParams.push(status);
        }

        if (dateFrom && dateTo) {
            conditions.push('DATE(t.created_at) BETWEEN ? AND ?');
            queryParams.push(dateFrom, dateTo);
        } else if (dateFrom) {
            conditions.push('DATE(t.created_at) >= ?');
            queryParams.push(dateFrom);
        } else if (dateTo) {
            conditions.push('DATE(t.created_at) <= ?');
            queryParams.push(dateTo);
        }

        if (departmentId || designationId || employeeId) {
            let memberConditions = ['tm.team_id = t.id'];
            if (departmentId) {
                memberConditions.push('e.department_id = ?');
                queryParams.push(departmentId);
            }
            if (designationId) {
                memberConditions.push('e.designation_id = ?');
                queryParams.push(designationId);
            }
            if (employeeId) {
                memberConditions.push('tm.employee_id = ?');
                queryParams.push(employeeId);
            }

            conditions.push(`EXISTS (
                SELECT 1 FROM team_members tm 
                JOIN employees e ON tm.employee_id = e.id 
                WHERE ${memberConditions.join(' AND ')}
            )`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM teams t ${whereClause}`;
        const [totalRows] = await pool.query(countQuery, queryParams);
        const total = totalRows[0].total;

        // Get paginated data
        const dataQuery = `
            SELECT t.*, 
            (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.id) as total_members
            FROM teams t
            ${whereClause}
            ORDER BY t.id DESC
            LIMIT ? OFFSET ?
        `;

        const dataParams = [...queryParams, parseInt(limit), parseInt(offset)];
        const [rows] = await pool.query(dataQuery, dataParams);

        return {
            teams: rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM teams WHERE id = ? AND user_id = ?', [id, userId]);
        if (rows.length === 0) return null;

        const [members] = await pool.query(`
            SELECT e.*, 
            d.department_name, d.department_id as department_uid,
            deg.designation_name, deg.designation_id as designation_uid,
            tm.level
            FROM employees e
            JOIN team_members tm ON e.id = tm.employee_id
            LEFT JOIN departments d ON e.department_id = d.id 
            LEFT JOIN designations deg ON e.designation_id = deg.id
            WHERE tm.team_id = ?
            ORDER BY tm.level ASC
        `, [id]);

        return { ...rows[0], members };
    },

    update: async (id, data, userId) => {
        const { team_name, description, status, members } = data;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                'UPDATE teams SET team_name = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
                [team_name, description, status, id, userId]
            );

            if (result.affectedRows === 0) {
                throw new Error('Team not found or not authorized');
            }

            // Update members: delete existing and add new ones
            if (members && Array.isArray(members)) {
                await connection.query('DELETE FROM team_members WHERE team_id = ?', [id]);
                for (const member of members) {
                    await connection.query(
                        'INSERT INTO team_members (team_id, employee_id, level) VALUES (?, ?, ?)',
                        [id, member.employee_id, member.level || 1]
                    );
                }
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    delete: async (id, userId) => {
        await pool.query('DELETE FROM teams WHERE id = ? AND user_id = ?', [id, userId]);
    }
};

module.exports = Team;
