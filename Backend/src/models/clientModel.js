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
        let query = 'SELECT * FROM clients WHERE user_id = ?';
        const params = [userId];

        if (filters.status && filters.status !== 'all') {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.search) {
            query += ' AND (first_name LIKE ? OR last_name LIKE ? OR company_name LIKE ? OR email LIKE ?)';
            const term = `%${filters.search}%`;
            params.push(term, term, term, term);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await pool.query(query, params);
        return rows;
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
