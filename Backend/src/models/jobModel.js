const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

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
            posted_date,
            interview_rounds,
            application_fields
        } = jobData;

        const application_link = uuidv4();

        const query = `
      INSERT INTO jobs (
        user_id, title, department, location, type, 
        positions, description, responsibilities, requirements, status, posted_date,
        application_link, interview_rounds, application_fields
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const [result] = await pool.execute(query, [
            user_id, title, department, location, type,
            positions, description,
            JSON.stringify(responsibilities || []),
            JSON.stringify(requirements || []),
            status, posted_date,
            application_link,
            JSON.stringify(interview_rounds || []),
            JSON.stringify(application_fields || [])
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

        // Parse JSON fields
        const parsedRows = rows.map(job => ({
            ...job,
            responsibilities: typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : (job.responsibilities || []),
            requirements: typeof job.requirements === 'string' ? JSON.parse(job.requirements) : (job.requirements || []),
            interview_rounds: typeof job.interview_rounds === 'string' ? JSON.parse(job.interview_rounds) : (job.interview_rounds || []),
            application_fields: typeof job.application_fields === 'string' ? JSON.parse(job.application_fields) : (job.application_fields || [])
        }));

        return {
            jobs: parsedRows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages
            }
        };
    }

    static async findById(id, userId) {
        let query;
        let params;
        if (userId) {
            query = `SELECT * FROM jobs WHERE id = ? AND user_id = ?`;
            params = [id, userId];
        } else {
            query = `SELECT * FROM jobs WHERE id = ?`;
            params = [id];
        }
        const [rows] = await pool.execute(query, params);
        if (!rows[0]) return null;

        const job = rows[0];
        return {
            ...job,
            responsibilities: typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : (job.responsibilities || []),
            requirements: typeof job.requirements === 'string' ? JSON.parse(job.requirements) : (job.requirements || []),
            interview_rounds: typeof job.interview_rounds === 'string' ? JSON.parse(job.interview_rounds) : (job.interview_rounds || []),
            application_fields: typeof job.application_fields === 'string' ? JSON.parse(job.application_fields) : (job.application_fields || [])
        };
    }

    static async findByLink(link) {
        const query = `SELECT * FROM jobs WHERE application_link = ?`;
        const [rows] = await pool.execute(query, [link]);
        if (!rows[0]) return null;

        const job = rows[0];
        return {
            ...job,
            responsibilities: typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : (job.responsibilities || []),
            requirements: typeof job.requirements === 'string' ? JSON.parse(job.requirements) : (job.requirements || []),
            interview_rounds: typeof job.interview_rounds === 'string' ? JSON.parse(job.interview_rounds) : (job.interview_rounds || []),
            application_fields: typeof job.application_fields === 'string' ? JSON.parse(job.application_fields) : (job.application_fields || [])
        };
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
            status,
            interview_rounds,
            application_fields
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
        if (interview_rounds !== undefined) { fields.push('interview_rounds = ?'); params.push(JSON.stringify(interview_rounds)); }
        if (application_fields !== undefined) { fields.push('application_fields = ?'); params.push(JSON.stringify(application_fields)); }

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
        (SELECT COUNT(*) FROM applicants a JOIN jobs j ON a.job_id = j.id WHERE j.user_id = ?) as total_applicants
      FROM jobs
      WHERE user_id = ?
    `;
        const [rows] = await pool.execute(query, [userId, userId]);
        return rows[0];
    }
}

module.exports = Job;

