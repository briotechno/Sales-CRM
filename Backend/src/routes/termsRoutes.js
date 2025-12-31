const express = require('express');
const router = express.Router();
const termsController = require('../controllers/termsController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, termsController.createTerm);
router.get('/', protect, termsController.getAllTerms);
router.get('/:id', protect, termsController.getTermById);
router.put('/:id', protect, termsController.updateTerm);
router.delete('/:id', protect, termsController.deleteTerm);

module.exports = router;
