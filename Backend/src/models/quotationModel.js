const { pool } = require('../config/db');

const Quotation = {
    create: async (data, userId) => {
        const {
            client_name, company_name, email, phone, quotation_date,
            valid_until, currency, line_items, subtotal, tax,
            discount, total_amount, payment_terms, notes, status
        } = data;

        // Generate unique quotation_id if not provided
        let q_id = data.quotation_id;
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
            // Check if client already exists with this email
            const [existingClients] = await pool.query(
                'SELECT id FROM clients WHERE email = ? AND user_id = ? LIMIT 1',
                [email, userId]
            );

            if (existingClients.length > 0) {
                // Client exists, use existing client_id
                client_id = existingClients[0].id;
            } else {
                // Create new client
                const names = (client_name || '').split(' ');
                const first_name = names[0] || '';
                const last_name = names.slice(1).join(' ') || '';

                const [clientResult] = await pool.query(
                    `INSERT INTO clients (
                        user_id, type, first_name, last_name, email, phone,
                        company_name, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        userId,
                        company_name ? 'organization' : 'person',
                        first_name,
                        last_name,
                        email,
                        phone,
                        company_name,
                        'active'
                    ]
                );
                client_id = clientResult.insertId;
            }
        }

        const [result] = await pool.query(
            `INSERT INTO quotations (
                quotation_id, client_id, client_name, company_name, email, phone, 
                quotation_date, valid_until, currency, line_items, subtotal, 
                tax, discount, total_amount, payment_terms, notes, 
                status, user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                q_id, client_id, client_name, company_name, email, phone,
                quotation_date, valid_until, currency || 'INR',
                JSON.stringify(line_items || []), subtotal,
                tax, discount, total_amount, payment_terms, notes,
                status || 'Draft', userId
            ]
        );
        return result.insertId;
    },

    findAll: async (userId, page = 1, limit = 10, status = null, search = '') => {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM quotations WHERE user_id = ?';
        let countQuery = 'SELECT COUNT(*) as total FROM quotations WHERE user_id = ?';
        let queryParams = [userId];
        let countParams = [userId];

        if (status && status !== 'All') {
            query += ' AND status = ?';
            countQuery += ' AND status = ?';
            queryParams.push(status);
            countParams.push(status);
        }

        if (search) {
            const searchPattern = `%${search}%`;
            query += ' AND (client_name LIKE ? OR quotation_id LIKE ?)';
            countQuery += ' AND (client_name LIKE ? OR quotation_id LIKE ?)';
            queryParams.push(searchPattern, searchPattern);
            countParams.push(searchPattern, searchPattern);
        }

        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), parseInt(offset));

        const [totalRows] = await pool.query(countQuery, countParams);
        const total = totalRows[0].total;

        const [rows] = await pool.query(query, queryParams);

        const quotations = rows.map(row => ({
            ...row,
            line_items: typeof row.line_items === 'string' ? JSON.parse(row.line_items) : (row.line_items || [])
        }));

        return {
            quotations,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM quotations WHERE (id = ? OR quotation_id = ?) AND user_id = ?', [id, id, userId]);
        if (rows.length === 0) return null;

        const row = rows[0];
        return {
            ...row,
            line_items: typeof row.line_items === 'string' ? JSON.parse(row.line_items) : (row.line_items || [])
        };
    },

    update: async (id, data, userId) => {
        const {
            client_name, company_name, email, phone, quotation_date,
            valid_until, currency, line_items, subtotal, tax,
            discount, total_amount, payment_terms, notes, status
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
                client_id = ?, client_name = ?, company_name = ?, email = ?, phone = ?, 
                quotation_date = ?, valid_until = ?, currency = ?, line_items = ?, 
                subtotal = ?, tax = ?, discount = ?, total_amount = ?, 
                payment_terms = ?, notes = ?, status = ?
            WHERE id = ? AND user_id = ?`,
            [
                client_id, client_name, company_name, email, phone,
                quotation_date, valid_until, currency, JSON.stringify(line_items),
                subtotal, tax, discount, total_amount,
                payment_terms, notes, status, id, userId
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
