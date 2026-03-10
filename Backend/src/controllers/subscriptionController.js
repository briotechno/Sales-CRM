const { pool } = require('../config/db');
const Subscription = require('../models/subscriptionModel');

const getAllSubscriptions = async (req, res) => {
    try {
        const { status, searchTerm, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const subscriptions = await Subscription.findAll({ status, searchTerm, limit, offset });
        const total = await Subscription.countAll({ status, searchTerm });

        res.json({
            data: subscriptions,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSubscriptionById = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSubscription = async (req, res) => {
    try {
        const id = await Subscription.create(req.body);
        const newSubscription = await Subscription.findById(id);
        res.status(201).json(newSubscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSubscription = async (req, res) => {
    try {
        const success = await Subscription.update(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Subscription not found or no changes made' });
        }
        const updatedSubscription = await Subscription.findById(req.params.id);
        res.json(updatedSubscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSubscription = async (req, res) => {
    try {
        const success = await Subscription.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const [activeRows] = await pool.query('SELECT COUNT(*) as count FROM subscriptions WHERE status = "Active"');
        const [usersRows] = await pool.query('SELECT SUM(users) as count FROM subscriptions');
        const [planRows] = await pool.query('SELECT COUNT(DISTINCT plan) as count FROM subscriptions WHERE plan IS NOT NULL');

        res.status(200).json({
            success: true,
            data: {
                activeSubscriptions: activeRows[0].count || 0,
                totalUsers: usersRows[0].count || 0,
                totalPlans: planRows[0].count || 0
            }
        });
    } catch (error) {
        console.error('Get Subscription Stats error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

module.exports = {
    getAllSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    getDashboardStats
};
