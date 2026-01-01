const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/hrmDashboardController');
const { protect } = require('../middleware/authMiddleware');

// All dashboard data in one response (excluding Weekly Attendance as per request)
router.get('/', protect, getDashboardData);

module.exports = router;
