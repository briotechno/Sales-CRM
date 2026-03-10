const express = require('express');
const router = express.Router();
const { getWalletStats, getUpgradeHistory } = require('../controllers/walletController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(superAdmin);

router.get('/stats', getWalletStats);
router.get('/upgrades', getUpgradeHistory);

module.exports = router;
