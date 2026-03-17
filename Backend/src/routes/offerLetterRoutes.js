const express = require('express');
const router = express.Router();
const {
    createOfferLetter,
    getOfferLetters,
    getOfferLetterById,
    updateOfferLetter,
    deleteOfferLetter
} = require('../controllers/offerLetterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(authorize('offer_letter_view'), getOfferLetters)
    .post(authorize('offer_letter_create'), createOfferLetter);

router.route('/:id')
    .get(authorize('offer_letter_view'), getOfferLetterById)
    .put(authorize('offer_letter_edit'), updateOfferLetter)
    .delete(authorize('offer_letter_delete'), deleteOfferLetter);

module.exports = router;
