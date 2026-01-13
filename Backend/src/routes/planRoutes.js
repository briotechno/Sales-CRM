const express = require('express');
const router = express.Router();
const { getAllPlans, getPlanById, createPlan, updatePlan, deletePlan } = require('../controllers/planController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(superAdmin);

router.get('/', getAllPlans);
router.post('/', createPlan);
router.get('/:id', getPlanById);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

module.exports = router;
