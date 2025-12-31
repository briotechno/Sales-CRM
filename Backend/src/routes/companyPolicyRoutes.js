const express = require('express');
const router = express.Router();
const companyPolicyController = require('../controllers/companyPolicyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, companyPolicyController.createPolicy);
router.get('/', protect, companyPolicyController.getAllPolicies);
router.get('/:id', protect, companyPolicyController.getPolicyById);
router.put('/:id', protect, companyPolicyController.updatePolicy);
router.delete('/:id', protect, companyPolicyController.deletePolicy);

module.exports = router;
