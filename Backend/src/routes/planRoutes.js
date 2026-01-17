const express = require('express');
const router = express.Router();
const { getAllPlans, getPlanById, createPlan, updatePlan, deletePlan } = require('../controllers/planController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

// Public access to view plans
router.get('/', getAllPlans);

// Restricted to Super Admins
router.post('/', protect, superAdmin, createPlan);
router.get('/:id', protect, superAdmin, getPlanById);
router.put('/:id', protect, superAdmin, updatePlan);
router.delete('/:id', protect, superAdmin, deletePlan);

module.exports = router;
