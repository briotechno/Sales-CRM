const { pool } = require('../config/db');

const Quotation = {
    create: async (data, userId) => {
        const {
            quotation_id, customer_type, company_name, contact_person, email, phone,
            billing_address, shipping_address, state, pincode, gstin, pan_number, cin_number,
            quotation_date, valid_until, sales_executive, currency, line_items, subtotal, tax,
            discount, total_amount, terms_and_conditions, status
        } = data;

        // Generate unique quotation_id if not provided
        let q_id = quotation_id;
        if (!q_id) {
            const [rows] = await pool.query('SELECT quotation_id FROM quotations ORDER BY id DESC LIMIT 1');
            const year = new Date().getFullYear();
            let nextNum = 1000;
            if (rows.length > 0 && rows[0].quotation_id) {
                const lastId = rows[0].quotation_id;
                const parts = lastId.split('-');
                if (parts.length === 3) {
                    nextNum = parseInt(parts[2]) + 1;
                }
            }
            q_id = `QT-${year}-${nextNum}`;
        }

        // Auto-create or find existing client
        let client_id = null;
        if (email) {
            const [existingClients] = await pool.query(
                'SELECT id FROM clients WHERE email = ? AND user_id = ? LIMIT 1',
                [email, userId]
            );

            if (existingClients.length > 0) {
                client_id = existingClients[0].id;
            } else {
                const [clientResult] = await pool.query(
                    `INSERT INTO clients (
                        user_id, type, first_name, last_name, email, phone,
                        company_name, status, address, state, zip_code, tax_id
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        userId,
                        customer_type === 'Individual' ? 'person' : 'organization',
                        company_name || 'Customer',
                        '',
                        email,
                        phone,
                        company_name,
                        'active',
                        billing_address,
                        state,
                        pincode,
                        gstin
                    ]
                );
                client_id = clientResult.insertId;
            }
        }

        const [result] = await pool.query(
            `INSERT INTO quotations (
                quotation_id, client_id, customer_type, company_name, contact_person, email, phone, 
                billing_address, shipping_address, state, pincode, gstin, pan_number, cin_number,
                quotation_date, valid_until, sales_executive, currency, line_items, subtotal, 
                tax, discount, total_amount, payment_terms, 
                status, user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                q_id, client_id, customer_type || 'Business', company_name, contact_person, email, phone,
                billing_address, shipping_address, state, pincode, gstin, pan_number, cin_number,
                quotation_date, valid_until, sales_executive, currency || 'INR',
                JSON.stringify(line_items || []), subtotal,
                tax, discount, total_amount, terms_and_conditions,
                status || 'Draft', userId
            ]
        );
        return result.insertId;
    },

    findAll: async (userId, page = 1, limit = 10, status = null, search = '', dateFrom = null, dateTo = null) => {
        const offset = (page - 1) * limit;
        let whereClause = 'WHERE user_id = ?';
        let queryParams = [userId];

        if (status && status !== 'All') {
            whereClause += ' AND status = ?';
            queryParams.push(status);
        }

        if (search) {
            const searchPattern = `%${search}%`;
            whereClause += ' AND (company_name LIKE ? OR quotation_id LIKE ? OR email LIKE ?)';
            queryParams.push(searchPattern, searchPattern, searchPattern);
        }

        if (dateFrom) {
            whereClause += ' AND quotation_date >= ?';
            queryParams.push(dateFrom);
        }

        if (dateTo) {
            whereClause += ' AND quotation_date <= ?';
            queryParams.push(dateTo);
        }

        const statsQuery = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                SUM(COALESCE(total_amount, 0)) as totalValue
            FROM quotations 
            ${whereClause}
        `;
        const [statsRows] = await pool.query(statsQuery, queryParams);
        const summary = statsRows[0];

        const query = `
            SELECT * FROM quotations 
            ${whereClause} 
            ORDER BY id DESC LIMIT ? OFFSET ?
        `;
        const [rows] = await pool.query(query, [...queryParams, parseInt(limit), parseInt(offset)]);

        const quotations = rows.map(row => ({
            ...row,
            line_items: typeof row.line_items === 'string' ? JSON.parse(row.line_items) : (row.line_items || []),
            terms_and_conditions: row.payment_terms || ""
        }));

        return {
            quotations,
            summary,
            pagination: {
                total: summary.total || 0,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil((summary.total || 0) / limit)
            }
        };
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM quotations WHERE (id = ? OR quotation_id = ?) AND user_id = ?', [id, id, userId]);
        if (rows.length === 0) return null;

        const row = rows[0];
        return {
            ...row,
            line_items: typeof row.line_items === 'string' ? JSON.parse(row.line_items) : (row.line_items || []),
            terms_and_conditions: row.payment_terms || ""
        };
    },

    update: async (id, data, userId) => {
        const {
            customer_type, company_name, contact_person, email, phone,
            billing_address, shipping_address, state, pincode, gstin, pan_number, cin_number,
            quotation_date, valid_until, sales_executive, currency, line_items, subtotal, tax,
            discount, total_amount, terms_and_conditions, status
        } = data;

        // Update or find client_id if email is provided
        let client_id = null;
        if (email) {
            const [existingClients] = await pool.query(
                'SELECT id FROM clients WHERE email = ? AND user_id = ? LIMIT 1',
                [email, userId]
            );

            if (existingClients.length > 0) {
                client_id = existingClients[0].id;
            }
        }

        const [result] = await pool.query(
            `UPDATE quotations SET 
                client_id = ?, customer_type = ?, company_name = ?, contact_person = ?, email = ?, phone = ?, 
                billing_address = ?, shipping_address = ?, state = ?, pincode = ?, gstin = ?, pan_number = ?, cin_number = ?,
                quotation_date = ?, valid_until = ?, sales_executive = ?, currency = ?, line_items = ?, 
                subtotal = ?, tax = ?, discount = ?, total_amount = ?, 
                payment_terms = ?, status = ?
            WHERE id = ? AND user_id = ?`,
            [
                client_id, customer_type, company_name, contact_person, email, phone,
                billing_address, shipping_address, state, pincode, gstin, pan_number, cin_number,
                quotation_date, valid_until, sales_executive, currency, JSON.stringify(line_items),
                subtotal, tax, discount, total_amount,
                terms_and_conditions, status, id, userId
            ]
        );
        return result.affectedRows > 0;
    },

    delete: async (id, userId) => {
        const [result] = await pool.query('DELETE FROM quotations WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows > 0;
    },

    getStats: async (userId) => {
        const [rows] = await pool.query(
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                SUM(total_amount) as totalValue
            FROM quotations WHERE user_id = ?`,
            [userId]
        );
        return rows[0];
    }
};

module.exports = Quotation;
