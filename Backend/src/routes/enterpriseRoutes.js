const express = require('express');
const router = express.Router();
const {
    createEnterprise,
    getAllEnterprises,
    getEnterpriseById,
    updateEnterprise,
    deleteEnterprise
} = require('../controllers/enterpriseController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

// All enterprise routes are restricted to Super Admins
router.use(protect);
router.use(superAdmin);

router.post('/', createEnterprise);
router.get('/', getAllEnterprises);
router.get('/:id', getEnterpriseById);
router.put('/:id', updateEnterprise);
router.delete('/:id', deleteEnterprise);

module.exports = router;
