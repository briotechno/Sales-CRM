const Quotation = require('../models/quotationModel');

exports.createQuotation = async (req, res) => {
    try {
        const quotationId = await Quotation.create(req.body, req.user.id);
        res.status(201).json({ success: true, id: quotationId, message: 'Quotation created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getQuotations = async (req, res) => {
    try {
        const { page, limit, status, search, dateFrom, dateTo } = req.query;
        const result = await Quotation.findAll(req.user.id, page, limit, status, search, dateFrom, dateTo);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getQuotationById = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id, req.user.id);
        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Quotation not found' });
        }
        res.status(200).json({ success: true, quotation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateQuotation = async (req, res) => {
    try {
        const updated = await Quotation.update(req.params.id, req.body, req.user.id);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Quotation not found' });
        }
        res.status(200).json({ success: true, message: 'Quotation updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteQuotation = async (req, res) => {
    try {
        const deleted = await Quotation.delete(req.params.id, req.user.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Quotation not found' });
        }
        res.status(200).json({ success: true, message: 'Quotation deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
