const Announcement = require('../models/announcementModel');

const announcementController = {
    createAnnouncement: async (req, res) => {
        try {
            const data = req.body;
            // Ensure date is set if not provided
            if (!data.date) {
                data.date = new Date().toISOString().split('T')[0];
            }
            const announcementId = await Announcement.create(data, req.user.id);
            res.status(201).json({ message: 'Announcement created successfully', id: announcementId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAnnouncements: async (req, res) => {
        try {
            const { page, limit, category, search } = req.query;
            const data = await Announcement.findAll(req.user.id, page, limit, category, search);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAnnouncementById: async (req, res) => {
        try {
            const announcement = await Announcement.findById(req.params.id, req.user.id);
            if (!announcement) {
                return res.status(404).json({ message: 'Announcement not found' });
            }
            res.status(200).json(announcement);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateAnnouncement: async (req, res) => {
        try {
            const data = req.body;
            const updated = await Announcement.update(req.params.id, data, req.user.id);
            if (!updated) {
                return res.status(404).json({ message: 'Announcement not found or not authorized' });
            }
            res.status(200).json({ message: 'Announcement updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteAnnouncement: async (req, res) => {
        try {
            const deleted = await Announcement.delete(req.params.id, req.user.id);
            if (!deleted) {
                return res.status(404).json({ message: 'Announcement not found or not authorized' });
            }
            res.status(200).json({ message: 'Announcement deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = announcementController;
