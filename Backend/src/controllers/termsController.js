const Terms = require('../models/termsModel');

const termsController = {
    createTerm: async (req, res) => {
        try {
            const userId = req.user.id;
            const termId = await Terms.create(req.body, userId);
            res.status(201).json({ message: 'Terms & Conditions created successfully', termId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllTerms: async (req, res) => {
        try {
            const userId = req.user.id;
            const filters = {
                department: req.query.department,
                designation: req.query.designation,
                search: req.query.search
            };
            const terms = await Terms.findAll(userId, filters);
            res.json(terms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getTermById: async (req, res) => {
        try {
            const userId = req.user.id;
            const term = await Terms.findById(req.params.id, userId);
            if (!term) return res.status(404).json({ message: 'Terms & Conditions not found' });
            res.json(term);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateTerm: async (req, res) => {
        try {
            const userId = req.user.id;
            await Terms.update(req.params.id, req.body, userId);
            res.json({ message: 'Terms & Conditions updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteTerm: async (req, res) => {
        try {
            const userId = req.user.id;
            await Terms.delete(req.params.id, userId);
            res.json({ message: 'Terms & Conditions deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = termsController;
