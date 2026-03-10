const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getEnterpriseGrowth,
    getRevenueAnalytics,
    getSubscriptionDistribution,
    getUpgradeDowngradeTrends,
    getProductKeyStats,
    getChurnAlerts,
    getRecentEnterprises,
    getUsageStats,
} = require('../controllers/superAdminDashboardController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(superAdmin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/enterprise-growth', getEnterpriseGrowth);
router.get('/revenue-analytics', getRevenueAnalytics);
router.get('/subscription-distribution', getSubscriptionDistribution);
router.get('/upgrade-downgrade-trends', getUpgradeDowngradeTrends);
router.get('/product-key-stats', getProductKeyStats);
router.get('/churn-alerts', getChurnAlerts);
router.get('/recent-enterprises', getRecentEnterprises);
router.get('/usage-stats', getUsageStats);

module.exports = router;
