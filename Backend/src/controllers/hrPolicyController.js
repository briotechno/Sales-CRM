const HRPolicy = require('../models/hrPolicyModel');
const path = require('path');

const hrPolicyController = {
    createPolicy: async (req, res) => {
        try {
            const userId = req.user.id;
            const data = { ...req.body };
            if (req.file) {
                data.document_path = `/uploads/policies/${req.file.filename}`;
            }
            const policyId = await HRPolicy.create(data, userId);
            res.status(201).json({ message: 'HR Policy created successfully', policyId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllPolicies: async (req, res) => {
        try {
            const userId = req.user.id;
            const filters = {
                category: req.query.category,
                status: req.query.status,
                search: req.query.search,
                department: req.query.department
            };
            const policies = await HRPolicy.findAll(userId, filters);
            res.json(policies);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getPolicyById: async (req, res) => {
        try {
            const userId = req.user.id;
            const policy = await HRPolicy.findById(req.params.id, userId);
            if (!policy) return res.status(404).json({ message: 'HR Policy not found' });
            res.json(policy);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updatePolicy: async (req, res) => {
        try {
            const userId = req.user.id;
            const data = { ...req.body };
            if (req.file) {
                data.document_path = `/uploads/policies/${req.file.filename}`;
            }
            await HRPolicy.update(req.params.id, data, userId);
            res.json({ message: 'HR Policy updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deletePolicy: async (req, res) => {
        try {
            const userId = req.user.id;
            await HRPolicy.delete(req.params.id, userId);
            res.json({ message: 'HR Policy deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = hrPolicyController;
