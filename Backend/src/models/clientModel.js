const { pool } = require('../config/db');

const Client = {
    create: async (data, userId) => {
        const {
            type, first_name, last_name, email, phone,
            company_name, position, birthday, source,
            industry, website, number_of_employees, tax_id,
            address, city, state, zip_code, country,
            status, notes,
            agreement_url, quotation_id, quotation_url, budget, services,
            project_type, start_date, end_date, subscription_date, lead_id
        } = data;

        const [result] = await pool.query(
            `INSERT INTO clients (
                user_id, type, first_name, last_name, email, phone,
                company_name, position, birthday, source,
                industry, website, number_of_employees, tax_id,
                address, city, state, zip_code, country,
                status, notes,
                agreement_url, quotation_id, quotation_url, budget, services,
                project_type, start_date, end_date, subscription_date, lead_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, type, first_name, last_name, email, phone,
                company_name, position, birthday, source,
                industry, website, number_of_employees, tax_id,
                address, city, state, zip_code, country,
                status || 'active', notes,
                agreement_url, quotation_id, quotation_url, budget, services,
                project_type, start_date, end_date, subscription_date, lead_id
            ]
        );
        return result.insertId;
    },

    findAll: async (userId, filters = {}) => {
        let countQuery = 'SELECT COUNT(*) as total FROM clients WHERE user_id = ?';
        let query = 'SELECT * FROM clients WHERE user_id = ?';
        const params = [userId];

        if (filters.status && filters.status !== 'all') {
            const statusFilter = ' AND status = ?';
            countQuery += statusFilter;
            query += statusFilter;
            params.push(filters.status);
        }

        if (filters.industry && filters.industry !== 'all') {
            const industryFilter = ' AND industry = ?';
            countQuery += industryFilter;
            query += industryFilter;
            params.push(filters.industry);
        }

        if (filters.source && filters.source !== 'all') {
            const sourceFilter = ' AND source = ?';
            countQuery += sourceFilter;
            query += sourceFilter;
            params.push(filters.source);
        }

        if (filters.search) {
            const searchFilter = ' AND (first_name LIKE ? OR last_name LIKE ? OR company_name LIKE ? OR email LIKE ?)';
            countQuery += searchFilter;
            query += searchFilter;
            const term = `%${filters.search}%`;
            params.push(term, term, term, term);
        }

        const [totalRows] = await pool.query(countQuery, params);
        const total = totalRows[0].total;

        query += ' ORDER BY created_at DESC';

        // Pagination
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 10;
        const offset = (page - 1) * limit;

        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [rows] = await pool.query(query, params);

        return {
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query(
            'SELECT * FROM clients WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0];
    },

    update: async (id, data, userId) => {
        const {
            type, first_name, last_name, email, phone,
            company_name, position, birthday, source,
            industry, website, number_of_employees, tax_id,
            address, city, state, zip_code, country,
            status, notes
        } = data;

        const [result] = await pool.query(
            `UPDATE clients SET
        type = ?, first_name = ?, last_name = ?, email = ?, phone = ?,
        company_name = ?, position = ?, birthday = ?, source = ?,
        industry = ?, website = ?, number_of_employees = ?, tax_id = ?,
        address = ?, city = ?, state = ?, zip_code = ?, country = ?,
        status = ?, notes = ?
       WHERE id = ? AND user_id = ?`,
            [
                type, first_name, last_name, email, phone,
                company_name, position, birthday, source,
                industry, website, number_of_employees, tax_id,
                address, city, state, zip_code, country,
                status, notes, id, userId
            ]
        );
        return result.affectedRows > 0;
    },

    delete: async (id, userId) => {
        const [result] = await pool.query(
            'DELETE FROM clients WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    },

    // Get all quotations for a specific client
    getClientQuotations: async (clientId, userId) => {
        const [rows] = await pool.query(
            'SELECT * FROM quotations WHERE client_id = ? AND user_id = ? ORDER BY created_at DESC',
            [clientId, userId]
        );
        return rows.map(row => ({
            ...row,
            line_items: typeof row.line_items === 'string' ? JSON.parse(row.line_items) : (row.line_items || [])
        }));
    },

    findByEmailOrPhone: async (userId, email, phone) => {
        if (!email && !phone) return null;
        let query = 'SELECT * FROM clients WHERE user_id = ? AND (';
        const params = [userId];

        if (email && phone) {
            query += 'email = ? OR phone = ?';
            params.push(email, phone);
        } else if (email) {
            query += 'email = ?';
            params.push(email);
        } else {
            query += 'phone = ?';
            params.push(phone);
        }
        query += ') LIMIT 1';

        const [rows] = await pool.query(query, params);
        return rows[0];
    }
};

module.exports = Client;
