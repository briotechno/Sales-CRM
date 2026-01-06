const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');

router.use(protect); // Protect all routes

router.route('/')
    .post(upload.single('receipt'), createExpense)
    .get(getExpenses);

router.route('/:id')
    .get(getExpenseById)
    .put(upload.single('receipt'), updateExpense)
    .delete(deleteExpense);

module.exports = router;
