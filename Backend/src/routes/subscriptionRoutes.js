const express = require('express');
const router = express.Router();
const {
    getAllSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    getDashboardStats
} = require('../controllers/subscriptionController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(superAdmin);

router.get('/dashboard-stats', getDashboardStats);

router.route('/')
    .get(getAllSubscriptions)
    .post(createSubscription);

router.route('/:id')
    .get(getSubscriptionById)
    .put(updateSubscription)
    .delete(deleteSubscription);

module.exports = router;
