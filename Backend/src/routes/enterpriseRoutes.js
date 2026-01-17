const express = require('express');
const router = express.Router();
const {
    createEnterprise,
    getAllEnterprises,
    getEnterpriseById,
    updateEnterprise,
    deleteEnterprise,
    completeOnboarding
} = require('../controllers/enterpriseController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.use(protect);

// Publicly available for authenticated users to complete their own onboarding
router.post('/onboard', completeOnboarding);

// Restricted to Super Admins
router.post('/', superAdmin, createEnterprise);
router.get('/', superAdmin, getAllEnterprises);
router.get('/:id', superAdmin, getEnterpriseById);
router.put('/:id', superAdmin, updateEnterprise);
router.delete('/:id', superAdmin, deleteEnterprise);

module.exports = router;
