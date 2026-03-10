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
            const { plan, employees, storage, price, leads } = req.body;
            const userId = req.user.id;

            // Find the enterprise by admin_id
            const enterprise = await Enterprise.findByAdminId(userId);

            if (!enterprise) {
                return res.status(404).json({
                    success: false,
                    message: 'Enterprise not found for this user'
                });
            }

            // Fetch Plan details to get defaults (especially leads if not passed)
            const planDetails = await Plan.findByName(plan);

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
                leads: leads || (planDetails ? planDetails.monthly_leads : 0),
                storage: storage || (planDetails ? planDetails.default_storage : 0),
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

            // Fetch active subscription for plan details
            const activeSubscription = await Subscription.findActiveByEnterpriseId(enterprise.id);

            // Usage counts across different tables
            // 1. Total Employees (Users with role 'Employee' or assigned to this enterprise's admin)
            // Enterprise has an admin_id, we need to count users belonging to this admin's workspace
            const [empRows] = await pool.query(
                'SELECT COUNT(*) as total, SUM(CASE WHEN status = "Active" THEN 1 ELSE 0 END) as active, SUM(CASE WHEN status = "Inactive" THEN 1 ELSE 0 END) as inactive FROM employees WHERE user_id = ?',
                [enterprise.admin_id]
            );

            // 2. Leads count for this enterprise
            const [leadRows] = await pool.query(
                'SELECT COUNT(*) as count FROM leads WHERE user_id = ?',
                [enterprise.admin_id]
            );

            // Merge everything into a final response
            const fullData = {
                ...enterprise,
                // Plan info from subscription
                plan: activeSubscription?.plan || enterprise.plan || 'N/A',
                planExpiry: activeSubscription?.expiryDate || null,
                onboardingDate: activeSubscription?.onboardingDate || enterprise.onboardingDate,
                billingCycle: activeSubscription?.billingCycle || 'N/A',

                // Limits from subscription (fallbacks to 0 if missing)
                usersLimit: parseInt(activeSubscription?.users) || 0,
                leadsLimit: parseInt(activeSubscription?.leads) || 0,
                storageLimit: parseFloat(activeSubscription?.storage) || 0,

                // Actual usage metrics
                usersUsed: parseInt(empRows[0].total) || 0,
                activeUsers: parseInt(empRows[0].active) || 0,
                inactiveUsers: parseInt(empRows[0].inactive) || 0,
                leadsUsed: parseInt(leadRows[0].count) || 0,
                storageUsed: 0, // Placeholder for storage
            };

            res.status(200).json({
                success: true,
                data: fullData
            });
        } catch (error) {
            console.error('GetEnterpriseById Error:', error);
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
                leads: keyData.leads || (planDetails ? planDetails.monthly_leads : 0),
                storage: keyData.storage || (planDetails ? planDetails.default_storage : 0),
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

            // Fallback to Plan limits if Subscription has 0/missing limits (fixes legacy/buggy data)
            if (activeSubscription) {
                if (!activeSubscription.leads || !activeSubscription.storage) {
                    const planDetails = await Plan.findByName(activeSubscription.plan);
                    if (planDetails) {
                        if (!activeSubscription.leads) activeSubscription.leads = planDetails.monthly_leads;
                        if (!activeSubscription.storage) activeSubscription.storage = planDetails.default_storage;
                    }
                }
            }

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
    },

    // @desc    Get Dashboard Stats
    // @route   GET /api/enterprises/dashboard-stats
    // @access  Super Admin
    getDashboardStats: async (req, res) => {
        try {
            const [activeRows] = await pool.query('SELECT COUNT(*) as count FROM enterprises WHERE status = "Active"');
            const [trialRows] = await pool.query('SELECT COUNT(*) as count FROM enterprises WHERE status = "Trial"');
            const [planRows] = await pool.query('SELECT COUNT(DISTINCT plan) as count FROM enterprises WHERE plan IS NOT NULL');

            res.status(200).json({
                success: true,
                data: {
                    activeEnterprises: activeRows[0].count,
                    activeTrials: trialRows[0].count,
                    totalPlans: planRows[0].count
                }
            });
        } catch (error) {
            console.error('Get Dashboard Stats error:', error);
            res.status(500).json({ success: false, message: error.message || 'Server Error' });
        }
    }
};

module.exports = enterpriseController;
