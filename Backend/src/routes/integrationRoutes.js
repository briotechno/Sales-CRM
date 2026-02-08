const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const { protect } = require('../middleware/authMiddleware');
const { checkLimit } = require('../middleware/limitMiddleware');

// CRM Forms
router.post('/forms', protect, integrationController.createForm);
router.get('/forms', protect, integrationController.getForms);
router.put('/forms/:id', protect, integrationController.updateForm);
router.delete('/forms/:id', protect, integrationController.deleteForm);

// Public Form Submission (No auth)
router.get('/forms/public/:slug', integrationController.getPublicForm);
router.post('/forms/submit/:slug', integrationController.submitPublicForm);


// Google Sheets
router.post('/sheets', protect, integrationController.createSheetConfig);
router.get('/sheets', protect, integrationController.getSheetsConfigs);
router.put('/sheets/:id', protect, integrationController.updateSheetConfig);
router.delete('/sheets/:id', protect, integrationController.deleteSheetConfig);
router.post('/sheets/:id/sync', protect, checkLimit('leads'), integrationController.syncSheet);


// Logs
router.get('/logs', protect, integrationController.getLogs);

module.exports = router;
