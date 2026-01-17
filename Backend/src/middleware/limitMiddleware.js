const { pool } = require('../config/db');
const Enterprise = require('../models/enterpriseModel');
const Subscription = require('../models/subscriptionModel');

const logLimitEvent = async (enterpriseId, userId, type, current, limit) => {
    try {
        await pool.query(
            'INSERT INTO limit_logs (enterprise_id, user_id, limit_type, attempted_value, limit_value, message) VALUES (?, ?, ?, ?, ?, ?)',
            [enterpriseId, userId, type, (current + 1).toString(), limit, `${type.charAt(0).toUpperCase() + type.slice(1)} limit reached`]
        );
    } catch (e) {
        console.error('Failed to log limit event:', e);
    }
};

const checkLimit = (type) => async (req, res, next) => {
    try {
        // Super Admin bypasses all limits
        if (req.user && req.user.role === 'Super Admin') return next();

        // Get the owner Admin ID
        const adminId = req.user.role === 'Admin' ? req.user.id : req.user.user_id;

        if (!adminId) {
            return res.status(401).json({ message: 'Not authorized, admin context missing' });
        }

        // 1. Find Enterprise
        const enterprise = await Enterprise.findByAdminId(adminId);
        if (!enterprise) {
            return res.status(404).json({ message: 'Enterprise not found for this account' });
        }

        // 2. Find Active Subscription
        const subscription = await Subscription.findActiveByEnterpriseId(enterprise.id);
        if (!subscription) {
            return res.status(403).json({
                limitReached: true,
                type: 'subscription',
                message: 'No active subscription found. Please upgrade or renew your plan to continue.'
            });
        }

        // 3. Check specific limits
        if (type === 'users') {
            const [rows] = await pool.query('SELECT COUNT(*) as count FROM employees WHERE user_id = ?', [adminId]);
            const currentCount = rows[0].count;

            // 0 might mean unlimited in some contexts, but here we expect a positive limit
            if (subscription.users > 0 && currentCount >= subscription.users) {
                await logLimitEvent(enterprise.id, req.user.id, 'users', currentCount, subscription.users);
                return res.status(402).json({
                    limitReached: true,
                    type: 'users',
                    limit: subscription.users,
                    current: currentCount,
                    message: `Employee limit reached (${subscription.users}). Your current plan allows up to ${subscription.users} members.`
                });
            }
        }

        if (type === 'leads') {
            // Count leads created in the current billing cycle (since onboarding or last renewal)
            // For simplicity, we use onboardingDate if lastRenewalDate is not available
            const [rows] = await pool.query(
                'SELECT COUNT(*) as count FROM leads WHERE user_id = ? AND created_at >= ?',
                [adminId, subscription.onboardingDate]
            );
            const currentCount = rows[0].count;

            if (subscription.leads > 0 && currentCount >= subscription.leads) {
                await logLimitEvent(enterprise.id, req.user.id, 'leads', currentCount, subscription.leads);
                return res.status(402).json({
                    limitReached: true,
                    type: 'leads',
                    limit: subscription.leads,
                    current: currentCount,
                    message: `Monthly leads limit reached (${subscription.leads}). Please upgrade your plan for more leads.`
                });
            }
        }

        // Storage limit check (calculated in MB/GB)
        if (type === 'storage') {
            // This would require a way to track storage usage per enterprise
            // For now, placeholder for future implementation
            next();
            return;
        }

        next();
    } catch (error) {
        console.error('Limit Check Middleware Error:', error);
        res.status(500).json({ message: 'Internal Server Error during limit check' });
    }
};

module.exports = { checkLimit };
