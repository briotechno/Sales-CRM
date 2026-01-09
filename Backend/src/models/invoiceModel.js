const { pool } = require('../config/db');

const Invoice = {
    create: async (data, userId) => {
        const {
            invoice_number, client_id, client_name, client_email, client_phone,
            client_address, invoice_date, due_date, items, subtotal,
            tax_rate, tax_amount, total_amount, paid_amount, balance_amount,
            status, notes, quotation_id
        } = data;

        const [result] = await pool.query(
            `INSERT INTO invoices (
                invoice_number, quotation_id, client_id, user_id, client_name, client_email, client_phone,
                client_address, invoice_date, due_date, items, subtotal,
                tax_rate, tax_amount, total_amount, paid_amount, balance_amount,
                status, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                invoice_number, quotation_id, client_id, userId, client_name, client_email, client_phone,
                client_address, invoice_date, due_date, JSON.stringify(items), subtotal,
                tax_rate, tax_amount, total_amount, paid_amount || 0, balance_amount,
                status || 'Unpaid', notes
            ]
        );
        return result.insertId;
    },

    findAll: async (userId, filters = {}) => {
        let query = 'SELECT * FROM invoices WHERE user_id = ?';
        const params = [userId];

        if (filters.status && filters.status !== 'all') {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.search) {
            query += ' AND (invoice_number LIKE ? OR client_name LIKE ? OR client_email LIKE ?)';
            const term = `%${filters.search}%`;
            params.push(term, term, term);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await pool.query(query, params);
        return rows.map(row => ({
            ...row,
            items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items
        }));
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
            invoice_number, client_id, client_name, client_email, client_phone,
            client_address, invoice_date, due_date, items, subtotal,
            tax_rate, tax_amount, total_amount, paid_amount, balance_amount,
            status, notes, quotation_id
        } = data;

        const [result] = await pool.query(
            `UPDATE invoices SET
                invoice_number = ?, quotation_id = ?, client_id = ?, client_name = ?, client_email = ?, client_phone = ?,
                client_address = ?, invoice_date = ?, due_date = ?, items = ?, subtotal = ?,
                tax_rate = ?, tax_amount = ?, total_amount = ?, paid_amount = ?, balance_amount = ?,
                status = ?, notes = ?
            WHERE id = ? AND user_id = ?`,
            [
                invoice_number, quotation_id, client_id, client_name, client_email, client_phone,
                client_address, invoice_date, due_date, JSON.stringify(items), subtotal,
                tax_rate, tax_amount, total_amount, paid_amount, balance_amount,
                status, notes, id, userId
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
