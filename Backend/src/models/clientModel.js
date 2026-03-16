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

    // Files
    getFiles: async (clientId, userId) => {
        // First get client details to see if there's a lead_id
        const [client] = await pool.query('SELECT lead_id FROM clients WHERE id = ?', [clientId]);
        const leadId = client.length > 0 ? client[0].lead_id : null;

        let query = `
            SELECT id, user_id, 
                   CONVERT(name USING utf8mb4) as name, 
                   CONVERT(path USING utf8mb4) as path, 
                   CONVERT(type USING utf8mb4) as type, 
                   size, 
                   CONVERT(description USING utf8mb4) as description, 
                   created_at, 
                   CONVERT('client' USING utf8mb4) as source
            FROM client_files 
            WHERE client_id = ? AND user_id = ?
        `;
        let params = [clientId, userId];

        if (leadId) {
            query += `
                UNION ALL
                SELECT id, user_id, 
                       CONVERT(name USING utf8mb4) as name, 
                       CONVERT(path USING utf8mb4) as path, 
                       CONVERT(type USING utf8mb4) as type, 
                       size, 
                       CONVERT(description USING utf8mb4) as description, 
                       created_at, 
                       CONVERT('lead' USING utf8mb4) as source
                FROM lead_files 
                WHERE lead_id = ? AND user_id = ?
            `;
            params.push(leadId, userId);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await pool.query(query, params);
        
        // Add uploader info
        const results = [];
        for (const row of rows) {
            const [user] = await pool.query(
                "SELECT CONCAT(firstName, ' ', lastName) as uploaded_by, profile_picture FROM users WHERE id = ?",
                [row.user_id]
            );
            results.push({
                ...row,
                uploaded_by: user.length > 0 ? user[0].uploaded_by : 'Unknown',
                profile_picture: user.length > 0 ? user[0].profile_picture : null
            });
        }
        return results;
    },

    addFile: async (data, userId) => {
        const { client_id, name, path, type, size, description } = data;
        
        // Ensure table exists (internal check)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS client_files (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id INT NOT NULL,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                path VARCHAR(255) NOT NULL,
                type VARCHAR(100),
                size INT,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
            )
        `);

        const [result] = await pool.query(
            'INSERT INTO client_files (client_id, user_id, name, path, type, size, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())',
            [client_id, userId, name, path, type, size, description || '']
        );
        return { id: result.insertId, ...data, created_at: new Date() };
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
    },
    deleteFile: async (fileId, userId) => {
        const [result] = await pool.query(
            'DELETE FROM client_files WHERE id = ? AND user_id = ?',
            [fileId, userId]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Client;
