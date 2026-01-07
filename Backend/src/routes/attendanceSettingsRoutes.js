const express = require('express');
const router = express.Router();
const attendanceSettingsController = require('../controllers/attendanceSettingsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', attendanceSettingsController.getSettings);
router.put('/', attendanceSettingsController.updateSettings);

module.exports = router;
