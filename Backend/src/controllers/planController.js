const Plan = require('../models/planModel');

const getAllPlans = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchTerm = req.query.searchTerm || '';
        const offset = (page - 1) * limit;

        const plans = await Plan.findAll({ limit, offset, searchTerm });
        const total = await Plan.countAll({ searchTerm });

        res.json({
            success: true,
            data: plans,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }
        res.json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createPlan = async (req, res) => {
    try {
        const planId = await Plan.create(req.body);
        const newPlan = await Plan.findById(planId);
        res.status(201).json({ success: true, data: newPlan, message: 'Plan created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updatePlan = async (req, res) => {
    try {
        await Plan.update(req.params.id, req.body);
        const updatedPlan = await Plan.findById(req.params.id);
        res.json({ success: true, data: updatedPlan, message: 'Plan updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deletePlan = async (req, res) => {
    try {
        await Plan.delete(req.params.id);
        res.json({ success: true, message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllPlans,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan
};
