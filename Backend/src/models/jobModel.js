const { pool } = require('../config/db');

class Job {
    static async create(jobData) {
        const {
            user_id,
            title,
            department,
            location,
            type,
            positions,
            description,
            responsibilities,
            requirements,
            status,
            posted_date
        } = jobData;

        const query = `
      INSERT INTO jobs (
        user_id, title, department, location, type, 
        positions, description, responsibilities, requirements, status, posted_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const [result] = await pool.execute(query, [
            user_id, title, department, location, type,
            positions, description,
            JSON.stringify(responsibilities || []),
            JSON.stringify(requirements || []),
            status, posted_date
        ]);

        return result.insertId;
    }

    static async findAll(userId, { page = 1, limit = 10, search = '', status = 'All' }) {
        const offset = (page - 1) * limit;
        let query = `SELECT * FROM jobs WHERE user_id = ?`;
        const params = [userId];

        if (search) {
            query += ` AND (title LIKE ? OR department LIKE ? OR location LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (status !== 'All') {
            query += ` AND status = ?`;
            params.push(status);
        }

        // Count query for pagination
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        // Add ordering and pagination
        query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit.toString(), offset.toString());

        const [rows] = await pool.execute(query, params);

        return {
            jobs: rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages
            }
        };
    }

    static async findById(id, userId) {
        const query = `SELECT * FROM jobs WHERE id = ? AND user_id = ?`;
        const [rows] = await pool.execute(query, [id, userId]);
        return rows[0];
    }

    static async update(id, userId, jobData) {
        const {
            title,
            department,
            location,
            type,
            positions,
            description,
            responsibilities,
            requirements,
            status
        } = jobData;

        // Build dynamic update query
        let fields = [];
        let params = [];

        if (title !== undefined) { fields.push('title = ?'); params.push(title); }
        if (department !== undefined) { fields.push('department = ?'); params.push(department); }
        if (location !== undefined) { fields.push('location = ?'); params.push(location); }
        if (type !== undefined) { fields.push('type = ?'); params.push(type); }
        if (positions !== undefined) { fields.push('positions = ?'); params.push(positions); }
        if (description !== undefined) { fields.push('description = ?'); params.push(description); }
        if (responsibilities !== undefined) { fields.push('responsibilities = ?'); params.push(JSON.stringify(responsibilities)); }
        if (requirements !== undefined) { fields.push('requirements = ?'); params.push(JSON.stringify(requirements)); }
        if (status !== undefined) { fields.push('status = ?'); params.push(status); }

        if (fields.length === 0) return false;

        const query = `UPDATE jobs SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
        params.push(id, userId);

        const [result] = await pool.execute(query, params);
        return result.affectedRows > 0;
    }

    static async delete(id, userId) {
        const query = `DELETE FROM jobs WHERE id = ? AND user_id = ?`;
        const [result] = await pool.execute(query, [id, userId]);
        return result.affectedRows > 0;
    }

    static async getStats(userId) {
        const query = `
      SELECT 
        COUNT(*) as total_jobs,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_jobs,
        SUM(positions) as total_positions,
        SUM(applicants) as total_applicants
      FROM jobs
      WHERE user_id = ?
    `;
        const [rows] = await pool.execute(query, [userId]);
        return rows[0];
    }
}

module.exports = Job;
