const Catalog = require('../models/catalogModel');

const catalogController = {
    createCatalog: async (req, res) => {
        try {
            const data = req.body;
            if (req.file) {
                data.image = `${req.protocol}://${req.get('host')}/uploads/catalogs/${req.file.filename}`;
            }

            // Parse JSON fields if they are sent as strings
            if (typeof data.images === 'string') data.images = JSON.parse(data.images);
            if (typeof data.features === 'string') data.features = JSON.parse(data.features);
            if (typeof data.specifications === 'string') data.specifications = JSON.parse(data.specifications);

            const catalogId = await Catalog.create(data, req.user.id);
            res.status(201).json({ message: 'Catalog created successfully', id: catalogId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getCatalogs: async (req, res) => {
        try {
            const { page, limit, status, search } = req.query;
            const data = await Catalog.findAll(req.user.id, page, limit, status, search);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getCatalogById: async (req, res) => {
        try {
            const catalog = await Catalog.findById(req.params.id, req.user.id);
            if (!catalog) {
                return res.status(404).json({ message: 'Catalog not found' });
            }
            res.status(200).json(catalog);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateCatalog: async (req, res) => {
        try {
            const data = req.body;
            if (req.file) {
                data.image = `${req.protocol}://${req.get('host')}/uploads/catalogs/${req.file.filename}`;
            }

            // Parse JSON fields if they are sent as strings
            if (typeof data.images === 'string') data.images = JSON.parse(data.images);
            if (typeof data.features === 'string') data.features = JSON.parse(data.features);
            if (typeof data.specifications === 'string') data.specifications = JSON.parse(data.specifications);

            const updated = await Catalog.update(req.params.id, data, req.user.id);
            if (!updated) {
                return res.status(404).json({ message: 'Catalog not found or not authorized' });
            }
            res.status(200).json({ message: 'Catalog updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteCatalog: async (req, res) => {
        try {
            const deleted = await Catalog.delete(req.params.id, req.user.id);
            if (!deleted) {
                return res.status(404).json({ message: 'Catalog not found or not authorized' });
            }
            res.status(200).json({ message: 'Catalog deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getPublicCatalogs: async (req, res) => {
        try {
            const { userId } = req.params;
            const { page, limit, status, search } = req.query;
            const data = await Catalog.findAll(userId, page, limit, status || 'Active', search);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = catalogController;
