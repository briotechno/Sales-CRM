const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/crmDashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);

module.exports = router;
