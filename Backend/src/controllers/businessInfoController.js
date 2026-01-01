const BusinessInfo = require('../models/businessInfoModel');

const createOrUpdateBusinessInfo = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware
        const data = {
            ...req.body,
            user_id: userId
        };

        if (req.file) {
            data.logo_url = `/uploads/logos/${req.file.filename}`;
        }

        const id = await BusinessInfo.createOrUpdate(data);
        const updatedInfo = await BusinessInfo.findByUserId(userId);

        res.status(200).json({
            message: 'Business information updated successfully',
            data: updatedInfo
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBusinessInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const info = await BusinessInfo.findByUserId(userId);

        if (!info) {
            return res.status(404).json({ message: 'Business information not found' });
        }

        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPublicBusinessInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const info = await BusinessInfo.findById(id);

        if (!info) {
            return res.status(404).json({ message: 'Business information not found' });
        }

        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrUpdateBusinessInfo,
    getBusinessInfo,
    getPublicBusinessInfo
};
