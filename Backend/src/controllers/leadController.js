const Lead = require('../models/leadModel');

const createLead = async (req, res) => {
    try {
        const { name, mobile_number, pipeline_id, stage_id, value } = req.body;

        if (!name) return res.status(400).json({ message: 'Lead Name is required' });
        if (!mobile_number) return res.status(400).json({ message: 'Mobile Number is required' });
        if (!pipeline_id) return res.status(400).json({ message: 'Pipeline is required' });
        if (!stage_id) return res.status(400).json({ message: 'Stage is required' });

        const id = await Lead.create(req.body, req.user.id);
        res.status(201).json({ status: true, message: 'Lead created successfully', id });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getLeads = async (req, res) => {
    try {
        const { page, limit, search, status, pipeline_id, tag, type, subview, priority, services, dateFrom, dateTo } = req.query;
        const data = await Lead.findAll(req.user.id, page, limit, search, status, pipeline_id, tag, type, subview, priority, services, dateFrom, dateTo);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id, req.user.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id, req.user.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        await Lead.update(req.params.id, req.body, req.user.id);
        res.status(200).json({ status: true, message: 'Lead updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id, req.user.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        await Lead.delete(req.params.id, req.user.id);
        res.status(200).json({ status: true, message: 'Lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead
};
