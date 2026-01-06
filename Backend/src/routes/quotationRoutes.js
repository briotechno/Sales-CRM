const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', quotationController.createQuotation);
router.get('/', quotationController.getQuotations);
router.get('/:id', quotationController.getQuotationById);
router.put('/:id', quotationController.updateQuotation);
router.delete('/:id', quotationController.deleteQuotation);

module.exports = router;
