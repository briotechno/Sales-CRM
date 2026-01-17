const express = require('express');
const router = express.Router();
const { getMainDashboardStats } = require('../controllers/mainDashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getMainDashboardStats);

module.exports = router;
