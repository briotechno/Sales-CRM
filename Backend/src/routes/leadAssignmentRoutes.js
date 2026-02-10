const express = require('express');
const router = express.Router();
const leadAssignmentController = require('../controllers/leadAssignmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/settings', leadAssignmentController.getSettings);
router.post('/settings', leadAssignmentController.updateSettings);
router.get('/logs', leadAssignmentController.getLogs);
router.post('/assign-manual', leadAssignmentController.manualAssignLeads);

module.exports = router;
