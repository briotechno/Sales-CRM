const Invoice = require('../models/invoiceModel');

const invoiceController = {
    createInvoice: async (req, res) => {
        try {
            const invoiceId = await Invoice.create(req.body, req.user.id);
            res.status(201).json({ success: true, message: 'Invoice created successfully', id: invoiceId });
        } catch (error) {
            console.error('Error creating invoice:', error);
            res.status(500).json({ success: false, message: 'Error creating invoice' });
        }
    },

    getAllInvoices: async (req, res) => {
        try {
            const { status, search } = req.query;
            const invoices = await Invoice.findAll(req.user.id, { status, search });
            res.json({ success: true, data: invoices });
        } catch (error) {
            console.error('Error fetching invoices:', error);
            res.status(500).json({ success: false, message: 'Error fetching invoices' });
        }
    },

    getInvoiceById: async (req, res) => {
        try {
            const invoice = await Invoice.findById(req.params.id, req.user.id);
            if (!invoice) {
                return res.status(404).json({ success: false, message: 'Invoice not found' });
            }
            res.json({ success: true, data: invoice });
        } catch (error) {
            console.error('Error fetching invoice:', error);
            res.status(500).json({ success: false, message: 'Error fetching invoice' });
        }
    },

    updateInvoice: async (req, res) => {
        try {
            const success = await Invoice.update(req.params.id, req.body, req.user.id);
            if (!success) {
                return res.status(404).json({ success: false, message: 'Invoice not found or no changes made' });
            }
            res.json({ success: true, message: 'Invoice updated successfully' });
        } catch (error) {
            console.error('Error updating invoice:', error);
            res.status(500).json({ success: false, message: 'Error updating invoice' });
        }
    },

    deleteInvoice: async (req, res) => {
        try {
            const success = await Invoice.delete(req.params.id, req.user.id);
            if (!success) {
                return res.status(404).json({ success: false, message: 'Invoice not found' });
            }
            res.json({ success: true, message: 'Invoice deleted successfully' });
        } catch (error) {
            console.error('Error deleting invoice:', error);
            res.status(500).json({ success: false, message: 'Error deleting invoice' });
        }
    }
};

module.exports = invoiceController;
