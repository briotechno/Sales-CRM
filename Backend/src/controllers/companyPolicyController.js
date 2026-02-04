const CompanyPolicy = require('../models/companyPolicyModel');

const companyPolicyController = {
    createPolicy: async (req, res) => {
        try {
            const userId = req.user.id;
            const policyId = await CompanyPolicy.create(req.body, userId);
            res.status(201).json({ message: 'Company Policy created successfully', policyId });
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
                author: req.query.author,
                startDate: req.query.startDate,
                endDate: req.query.endDate
            };
            const policies = await CompanyPolicy.findAll(userId, filters);
            res.json(policies);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getPolicyById: async (req, res) => {
        try {
            const userId = req.user.id;
            const policy = await CompanyPolicy.findById(req.params.id, userId);
            if (!policy) return res.status(404).json({ message: 'Company Policy not found' });
            res.json(policy);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updatePolicy: async (req, res) => {
        try {
            const userId = req.user.id;
            await CompanyPolicy.update(req.params.id, req.body, userId);
            res.json({ message: 'Company Policy updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deletePolicy: async (req, res) => {
        try {
            const userId = req.user.id;
            await CompanyPolicy.delete(req.params.id, userId);
            res.json({ message: 'Company Policy deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = companyPolicyController;
