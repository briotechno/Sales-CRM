const Enterprise = require('../models/enterpriseModel');
const Subscription = require('../models/subscriptionModel');

const enterpriseController = {
    // @desc    Complete onboarding for new enterprise (Select plan)
    // @route   POST /api/enterprises/onboard
    // @access  Private
    completeOnboarding: async (req, res) => {
        try {
            const { plan, employees, storage, price } = req.body;
            const userEmail = req.user.email;

            // Find the enterprise by email
            const enterprise = await Enterprise.findByEmail(userEmail);

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
                message: error.message || 'Server Error'
            });
        }
    },

    // @desc    Create new enterprise
    // @route   POST /api/enterprises
    // @access  Private/SuperAdmin
    createEnterprise: async (req, res) => {
        try {
            const enterpriseId = await Enterprise.create(req.body);
            const enterprise = await Enterprise.findById(enterpriseId);
            res.status(201).json({
                success: true,
                message: 'Enterprise created successfully',
                data: enterprise
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Server Error'
            });
        }
    },

    // @desc    Get all enterprises
    // @route   GET /api/enterprises
    // @access  Private/SuperAdmin
    getAllEnterprises: async (req, res) => {
        try {
            const { status, searchTerm, page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const enterprises = await Enterprise.findAll({ status, searchTerm, limit, offset });
            const total = await Enterprise.countAll({ status, searchTerm });

            res.status(200).json({
                success: true,
                count: enterprises.length,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                },
                data: enterprises
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Server Error'
            });
        }
    },

    // @desc    Get single enterprise
    // @route   GET /api/enterprises/:id
    // @access  Private/SuperAdmin
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

    // @desc    Update enterprise
    // @route   PUT /api/enterprises/:id
    // @access  Private/SuperAdmin
    updateEnterprise: async (req, res) => {
        try {
            const updated = await Enterprise.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Enterprise not found'
                });
            }
            const enterprise = await Enterprise.findById(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Enterprise updated successfully',
                data: enterprise
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Server Error'
            });
        }
    },

    // @desc    Delete enterprise
    // @route   DELETE /api/enterprises/:id
    // @access  Private/SuperAdmin
    deleteEnterprise: async (req, res) => {
        try {
            const deleted = await Enterprise.delete(req.params.id);
            if (!deleted) {
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
    }
};

module.exports = enterpriseController;
