const Enterprise = require('../models/enterpriseModel');
const Subscription = require('../models/subscriptionModel');
const ProductKey = require('../models/productKeyModel');
const Plan = require('../models/planModel');
const User = require('../models/userModel');
const { pool } = require('../config/db');

const enterpriseController = {
    // @desc    Complete onboarding for new enterprise (Select plan)
    // @route   POST /api/enterprises/onboard
    // @access  Private
    completeOnboarding: async (req, res) => {
        try {
            const { plan, employees, storage, price } = req.body;
            const userId = req.user.id; // Corrected to use req.user.id

            // Find the enterprise by admin_id
            const enterprise = await Enterprise.findByAdminId(userId);

            if (!enterprise) {
                return res.status(404).json({
                    success: false,
                    message: 'Enterprise not found for this user'
                });
            }

            // Update enterprise plan
            await Enterprise.update(enterprise.id, {
                ...enterprise,
                plan: plan,
                status: 'Active'
            });

            // Create initial subscription record
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month from now

            await Subscription.create({
                enterprise_id: enterprise.id,
                name: enterprise.businessName,
                plan: plan,
                status: 'Active',
                users: employees,
                amount: price,
                billingCycle: 'Monthly',
                onboardingDate: new Date(),
                expiryDate: expiryDate,
                leads: 0, // Initial
                storage: storage,
                features: []
            });

            res.status(200).json({
                success: true,
                message: 'Onboarding completed successfully',
                data: {
                    enterpriseId: enterprise.id,
                    plan: plan
                }
            });
        } catch (error) {
            console.error('Onboarding error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // @desc    Create a new enterprise (Super Admin only)
    createEnterprise: async (req, res) => {
        try {
            const enterpriseId = await Enterprise.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Enterprise created successfully',
                data: { enterpriseId }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Server Error'
            });
        }
    },

    // @desc    Get all enterprises (Super Admin only)
    getAllEnterprises: async (req, res) => {
        try {
            const { page = 1, limit = 10, searchTerm = '', status = 'all' } = req.query;
            const enterprises = await Enterprise.findAll({
                page: parseInt(page),
                limit: parseInt(limit),
                searchTerm,
                status
            });
            const total = await Enterprise.countAll({ searchTerm, status });

            res.status(200).json({
                success: true,
                data: enterprises,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Server Error'
            });
        }
    },

    // @desc    Get enterprise by ID (Super Admin only)
    getEnterpriseById: async (req, res) => {
        try {
            const enterprise = await Enterprise.findById(req.params.id);
            if (!enterprise) {
                return res.status(404).json({
                    success: false,
                    message: 'Enterprise not found'
                });
            }
            res.status(200).json({
                success: true,
                data: enterprise
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Server Error'
            });
        }
    },

    // @desc    Update enterprise (Super Admin only)
    updateEnterprise: async (req, res) => {
        try {
            const success = await Enterprise.update(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Enterprise not found or no changes made'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Enterprise updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Server Error'
            });
        }
    },

    // @desc    Delete enterprise (Super Admin only)
    deleteEnterprise: async (req, res) => {
        try {
            const success = await Enterprise.delete(req.params.id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Enterprise not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Enterprise deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Server Error'
            });
        }
    },

    // @desc    Redeem product key for an enterprise
    // @route   POST /api/enterprises/redeem-key
    // @access  Private (Admin only)
    redeemKey: async (req, res) => {
        try {
            const { productKey } = req.body;
            const userId = req.user.id;

            const enterprise = await Enterprise.findByAdminId(userId);
            if (!enterprise) {
                return res.status(404).json({ status: false, message: 'Enterprise not found' });
            }

            const keyData = await ProductKey.findByKey(productKey);
            if (!keyData) {
                return res.status(400).json({ status: false, message: 'Invalid product key' });
            }
            if (keyData.status === 'Active' || keyData.status === 'Used') {
                return res.status(400).json({ status: false, message: 'Product key already used' });
            }

            const planDetails = await Plan.findByName(keyData.plan);
            const expiryDate = new Date();

            if (keyData.validity === '1 Month') expiryDate.setMonth(expiryDate.getMonth() + 1);
            else if (keyData.validity === '3 Months') expiryDate.setMonth(expiryDate.getMonth() + 3);
            else if (keyData.validity === '1 Year') expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            else expiryDate.setMonth(expiryDate.getMonth() + 1);

            // Update enterprise
            await Enterprise.update(enterprise.id, {
                ...enterprise,
                plan: keyData.plan,
                status: 'Active'
            });

            // Create subscription
            await Subscription.create({
                enterprise_id: enterprise.id,
                name: enterprise.businessName,
                plan: keyData.plan,
                status: 'Active',
                users: keyData.users || (planDetails ? planDetails.default_users : 0),
                amount: planDetails ? planDetails.price : 0,
                billingCycle: keyData.validity === '1 Year' ? 'Yearly' : 'Monthly',
                onboardingDate: new Date(),
                expiryDate: expiryDate,
                leads: planDetails ? planDetails.monthly_leads : 0,
                storage: planDetails ? planDetails.default_storage : 0,
                features: []
            });

            await ProductKey.updateStatusByKey(productKey, 'Active', enterprise.id);

            res.status(200).json({
                status: true,
                message: 'Product key redeemed successfully',
                plan: keyData.plan
            });
        } catch (error) {
            console.error('Redeem key error:', error);
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // @desc    Get subscription stats and billing history
    // @route   GET /api/enterprises/subscription-stats
    // @access  Private
    getSubscriptionStats: async (req, res) => {
        try {
            const userId = req.user.id;
            const enterprise = await Enterprise.findByAdminId(userId);
            if (!enterprise) {
                return res.status(404).json({ success: false, message: 'Enterprise not found' });
            }

            const activeSubscription = await Subscription.findActiveByEnterpriseId(enterprise.id);

            // Usage counts
            const [empRows] = await pool.query('SELECT COUNT(*) as count FROM employees WHERE user_id = ?', [userId]);
            const [leadRows] = await pool.query('SELECT COUNT(*) as count FROM leads WHERE user_id = ?', [userId]);

            // Mock storage for now
            const storageUsed = 0;

            // Billing history
            const billingHistory = await Subscription.findByEnterpriseId(enterprise.id);

            res.status(200).json({
                success: true,
                data: {
                    enterprise,
                    activeSubscription,
                    usage: {
                        employees: empRows[0].count,
                        leads: leadRows[0].count,
                        storage: storageUsed
                    },
                    billingHistory
                }
            });
        } catch (error) {
            console.error('Get stats error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = enterpriseController;
