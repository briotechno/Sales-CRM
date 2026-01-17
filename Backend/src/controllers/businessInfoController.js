const BusinessInfo = require('../models/businessInfoModel');
const User = require('../models/userModel');

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
            // Fallback to User data if business info not found
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const fallbackInfo = {
                user_id: userId,
                company_name: user.businessName || '',
                legal_name: user.businessName || '',
                business_type: user.businessType || 'Private Limited Company',
                email: user.email || '',
                phone: user.mobileNumber || '',
                gst_number: user.gst || '',
                street_address: user.address || '',
                industry: 'Information Technology' // Default
            };

            return res.status(200).json(fallbackInfo);
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
