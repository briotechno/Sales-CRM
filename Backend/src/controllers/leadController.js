const Lead = require('../models/leadModel');
const leadAssignmentService = require('../services/leadAssignmentService');
const LeadAssignmentLog = require('../models/leadAssignmentLogModel');

const createLead = async (req, res) => {
    try {
        const id = await Lead.create(req.body, req.user.id);

        // Handle Auto-Assignment if enabled
        await leadAssignmentService.autoAssign(id, req.user.id);

        // If manual assignment was passed directly (owner/assigned_to)
        if (req.body.owner || req.body.assigned_to) {
            await LeadAssignmentLog.create({
                user_id: req.user.id,
                lead_id: id,
                employee_id: req.body.owner || req.body.assigned_to,
                assigned_by: req.user.username || 'admin',
                assignment_type: 'manual',
                reason: 'Initial Assignment'
            });
        }

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

const hitCall = async (req, res) => {
    try {
        const { status, next_call_at, drop_reason } = req.body;
        const result = await Lead.hitCall(req.params.id, status, next_call_at, drop_reason, req.user.id);

        // Auto-analyze after call
        await Lead.analyzeLead(req.params.id, req.user.id);

        res.status(200).json({ status: true, message: 'Call status updated', data: result });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const analyzeLead = async (req, res) => {
    try {
        await Lead.analyzeLead(req.params.id, req.user.id);
        res.status(200).json({ status: true, message: 'Lead analysis completed' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    hitCall,
    analyzeLead
};
