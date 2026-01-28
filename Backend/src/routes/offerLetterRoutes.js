const express = require('express');
const router = express.Router();
const {
    createOfferLetter,
    getOfferLetters,
    getOfferLetterById,
    updateOfferLetter,
    deleteOfferLetter
} = require('../controllers/offerLetterController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getOfferLetters)
    .post(createOfferLetter);

router.route('/:id')
    .get(getOfferLetterById)
    .put(updateOfferLetter)
    .delete(deleteOfferLetter);

module.exports = router;
