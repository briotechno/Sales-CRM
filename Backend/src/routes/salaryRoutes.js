const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createSalary,
    getSalaries,
    getSalaryById,
    updateSalary,
    deleteSalary,
    getSalaryStats
} = require('../controllers/salaryController');

router.use(protect); // Protect all routes

router.route('/')
    .post(createSalary)
    .get(getSalaries);

router.get('/stats', getSalaryStats);

router.route('/:id')
    .get(getSalaryById)
    .put(updateSalary)
    .delete(deleteSalary);

module.exports = router;
