const AnnouncementCategory = require('../models/announcementCategoryModel');

const announcementCategoryController = {
    createCategory: async (req, res) => {
        try {
            const data = req.body;
            const categoryId = await AnnouncementCategory.create(data, req.user.id);
            res.status(201).json({ message: 'Category created successfully', id: categoryId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getCategories: async (req, res) => {
        try {
            const { page, limit, status, search } = req.query;
            const data = await AnnouncementCategory.findAll(req.user.id, page, limit, status, search);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const category = await AnnouncementCategory.findById(req.params.id, req.user.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const data = req.body;
            const updated = await AnnouncementCategory.update(req.params.id, data, req.user.id);
            if (!updated) {
                return res.status(404).json({ message: 'Category not found or not authorized' });
            }
            res.status(200).json({ message: 'Category updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const deleted = await AnnouncementCategory.delete(req.params.id, req.user.id);
            if (!deleted) {
                return res.status(404).json({ message: 'Category not found or not authorized' });
            }
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = announcementCategoryController;
