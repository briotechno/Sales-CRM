const { pool } = require('../config/db');

const Invoice = {
    create: async (data, userId) => {
        const {
            invoice_number, quotation_id, client_id, client_name, client_email, client_phone,
            client_address, invoice_date, due_date, items, subtotal,
            tax_rate, tax_amount, discount, total_amount, paid_amount, balance_amount,
            status, notes, tax_type, client_gstin, business_gstin, pan_number,
            terms_and_conditions
        } = data;

        const [result] = await pool.query(
            `INSERT INTO invoices (
                invoice_number, quotation_id, client_id, user_id, client_name, client_email, client_phone,
                client_address, invoice_date, due_date, items, subtotal,
                tax_rate, tax_amount, discount, total_amount, paid_amount, balance_amount,
                status, notes, tax_type, client_gstin, business_gstin, pan_number,
                terms_and_conditions
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                invoice_number, quotation_id || null, client_id, userId, client_name, client_email, client_phone,
                client_address, invoice_date, due_date, JSON.stringify(items), subtotal,
                tax_rate, tax_amount, discount || 0, total_amount, paid_amount || 0, balance_amount,
                status || 'Unpaid', notes, tax_type || 'GST', client_gstin, business_gstin, pan_number,
                terms_and_conditions
            ]
        );
        return result.insertId;
    },

    findAll: async (userId, filters = {}, pagination = {}) => {
        const { status, search, dateFrom, dateTo } = filters;
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE user_id = ?';
        let queryParams = [userId];

        if (status && status !== 'all') {
            whereClause += ' AND status = ?';
            queryParams.push(status);
        }

        if (search) {
            whereClause += ' AND (invoice_number LIKE ? OR client_name LIKE ? OR client_email LIKE ?)';
            const term = `%${search}%`;
            queryParams.push(term, term, term);
        }

        if (dateFrom) {
            whereClause += ' AND invoice_date >= ?';
            queryParams.push(dateFrom);
        }

        if (dateTo) {
            whereClause += ' AND invoice_date <= ?';
            queryParams.push(dateTo);
        }

        const summaryQuery = `
            SELECT 
                COUNT(*) as totalCount,
                SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END) as paidCount,
                SUM(COALESCE(total_amount, 0)) as totalAmount,
                SUM(COALESCE(balance_amount, 0)) as totalBalance
            FROM invoices 
            ${whereClause}
        `;
        const [summaryResult] = await pool.query(summaryQuery, queryParams);

        const dataQuery = `
            SELECT * FROM invoices 
            ${whereClause} 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        `;
        const [rows] = await pool.query(dataQuery, [...queryParams, parseInt(limit), parseInt(offset)]);

        return {
            invoices: rows.map(row => ({
                ...row,
                items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items
            })),
            summary: {
                totalInvoices: summaryResult[0].totalCount || 0,
                paidInvoices: summaryResult[0].paidCount || 0,
                totalValue: summaryResult[0].totalAmount || 0,
                pendingBalance: summaryResult[0].totalBalance || 0
            },
            pagination: {
                total: summaryResult[0].totalCount || 0,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil((summaryResult[0].totalCount || 0) / limit)
            }
        };
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query(
            'SELECT * FROM invoices WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        if (rows[0]) {
            rows[0].items = typeof rows[0].items === 'string' ? JSON.parse(rows[0].items) : rows[0].items;
        }
        return rows[0];
    },

    update: async (id, data, userId) => {
        const {
            invoice_number, quotation_id, client_id, client_name, client_email, client_phone,
            client_address, invoice_date, due_date, items, subtotal,
            tax_rate, tax_amount, discount, total_amount, paid_amount, balance_amount,
            status, notes, tax_type, client_gstin, business_gstin, pan_number,
            terms_and_conditions
        } = data;

        const [result] = await pool.query(
            `UPDATE invoices SET
                invoice_number = ?, quotation_id = ?, client_id = ?, client_name = ?, client_email = ?, client_phone = ?,
                client_address = ?, invoice_date = ?, due_date = ?, items = ?, subtotal = ?,
                tax_rate = ?, tax_amount = ?, discount = ?, total_amount = ?, paid_amount = ?, balance_amount = ?,
                status = ?, notes = ?, tax_type = ?, client_gstin = ?, business_gstin = ?, pan_number = ?,
                terms_and_conditions = ?
            WHERE id = ? AND user_id = ?`,
            [
                invoice_number, quotation_id || null, client_id, client_name, client_email, client_phone,
                client_address, invoice_date, due_date, JSON.stringify(items), subtotal,
                tax_rate, tax_amount, discount || 0, total_amount, paid_amount, balance_amount,
                status, notes, tax_type || 'GST', client_gstin, business_gstin, pan_number,
                terms_and_conditions, id, userId
            ]
        );
        return result.affectedRows > 0;
    },

    delete: async (id, userId) => {
        const [result] = await pool.query(
            'DELETE FROM invoices WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Invoice;
