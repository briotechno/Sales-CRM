const { pool } = require('../config/db');

const Team = {
    create: async (data, userId) => {
        const { team_name, description, status, employee_ids } = data;

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
            if (employee_ids && Array.isArray(employee_ids)) {
                for (const empId of employee_ids) {
                    await connection.query(
                        'INSERT INTO team_members (team_id, employee_id) VALUES (?, ?)',
                        [teamTableId, empId]
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

    findAll: async (userId, page = 1, limit = 10) => {
        const offset = (page - 1) * limit;

        // Get total count
        const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM teams WHERE user_id = ?', [userId]);
        const total = totalRows[0].total;

        // Get paginated data
        const [rows] = await pool.query(`
            SELECT t.*, 
            (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.id) as total_members
            FROM teams t
            WHERE t.user_id = ?
            ORDER BY t.id DESC
            LIMIT ? OFFSET ?
        `, [userId, parseInt(limit), parseInt(offset)]);

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
            SELECT e.* 
            FROM employees e
            JOIN team_members tm ON e.id = tm.employee_id
            WHERE tm.team_id = ?
        `, [id]);

        return { ...rows[0], members };
    },

    update: async (id, data, userId) => {
        const { team_name, description, status, employee_ids } = data;

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
            if (employee_ids && Array.isArray(employee_ids)) {
                await connection.query('DELETE FROM team_members WHERE team_id = ?', [id]);
                for (const empId of employee_ids) {
                    await connection.query(
                        'INSERT INTO team_members (team_id, employee_id) VALUES (?, ?)',
                        [id, empId]
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
