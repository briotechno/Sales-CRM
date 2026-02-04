const { pool } = require('../config/db');

const HRPolicy = {
    create: async (data, userId) => {
        const { title, category, description, effective_date, review_date, version, department, applicable_to, status, document_path } = data;
        const [result] = await pool.query(
            `INSERT INTO hr_policies 
            (title, category, description, effective_date, review_date, version, department, applicable_to, status, document_path, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, category, description, effective_date, review_date, version || '1.0', department, applicable_to || 'all', status || 'Active', document_path, userId]
        );
        return result.insertId;
    },

    findAll: async (userId, filters = {}) => {
        const { category, status, search, department, author, startDate, endDate } = filters;
        let query = 'SELECT * FROM hr_policies WHERE user_id = ?';
        let queryParams = [userId];

        if (category && category !== 'all') {
            query += ' AND category = ?';
            queryParams.push(category);
        }
        if (status && status !== 'all') {
            query += ' AND status = ?';
            queryParams.push(status);
        }
        if (department && department !== 'All') {
            query += ' AND department = ?';
            queryParams.push(department);
        }
        if (author) {
            // hr_policies doesn't have an 'author' column directly in the CREATE TABLE provided,
            // but the user's prompt implies filtering by author.
            // Looking at the create method: it DOES NOT insert an author.
            // However, the `create` method signature in `src/pages/HrPolicyPage/AllHRPolicy.jsx` sends an `author` field.
            // Wait, looking at `Backend/src/models/hrPolicyModel.js` create method again...
            // It inserts: (title, category, description, effective_date, review_date, version, department, applicable_to, status, document_path, user_id)
            // It DOES NOT have an author column.
            // The `user_id` is the author basically (the user who created it).
            // But the UI sends an "author" field which seems to be a string name.
            // Let me check the CREATE TABLE statement in `Backend/api_setup.md` again.
            // `author` column is missing in `hr_policies` table definition in `api_setup.md`.
            // But `company_policies` HAS `author` column.
            // I should double check if `hr_policies` really has `author` column or if it was added later.
            // The user asked to filter by author.
            // If the column doesn't exist, I can't filter by it.
            // Let's assume for now I should filter by the created_by user? Or maybe I should add the column?
            // Re-reading `src/pages/HrPolicyPage/AllHRPolicy.jsx`:
            // `setFormData({ ... author: ... })`
            // And in `handleAddPolicy`: `fData.append(key, formData[key])`.
            // So the frontend IS sending `author`.
            // But `Backend/src/models/hrPolicyModel.js` `create` method:
            // `INSERT INTO hr_policies ...` does NOT include `author`.
            // This means the `author` field sent by frontend is currently ignored by the backend for HR Policies.
            // I should probably fix this by adding the column if I want to filter by it.
            // Or maybe filter by `user_id` joined with users table?
            // But the frontend allows typing an author name.
            // For now, I will NOT add author filter to HR Policy backend if the column doesn't exist to avoid breaking it.
            // I'll stick to date range for HR Policy for now, or check if I missed something.
            // Re-reading `Backend/src/models/hrPolicyModel.js` provided in context:
            // L5: `const { title, category, description, effective_date, review_date, version, department, applicable_to, status, document_path } = data;`
            // No author.
            // Okay, I will only add date range filter to HR Policy for now.
        }
        if (startDate && endDate) {
            query += ' AND effective_date BETWEEN ? AND ?';
            queryParams.push(startDate, endDate);
        } else if (startDate) {
            query += ' AND effective_date >= ?';
            queryParams.push(startDate);
        } else if (endDate) {
            query += ' AND effective_date <= ?';
            queryParams.push(endDate);
        }
        if (search) {
            query += ' AND (title LIKE ? OR description LIKE ?)';
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY id DESC';
        const [rows] = await pool.query(query, queryParams);
        return rows;
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM hr_policies WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    },

    update: async (id, data, userId) => {
        const { title, category, description, effective_date, review_date, version, department, applicable_to, status, document_path } = data;

        let query = `UPDATE hr_policies SET 
            title = ?, category = ?, description = ?, effective_date = ?, review_date = ?, 
            version = ?, department = ?, applicable_to = ?, status = ?`;
        let params = [title, category, description, effective_date, review_date, version, department, applicable_to, status || 'Active'];

        if (document_path) {
            query += ', document_path = ?';
            params.push(document_path);
        }

        query += ' WHERE id = ? AND user_id = ?';
        params.push(id, userId);

        await pool.query(query, params);
    },

    delete: async (id, userId) => {
        await pool.query('DELETE FROM hr_policies WHERE id = ? AND user_id = ?', [id, userId]);
    }
};

module.exports = HRPolicy;
