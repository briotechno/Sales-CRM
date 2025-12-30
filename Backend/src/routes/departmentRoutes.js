const express = require('express');
const router = express.Router();
const {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} = require('../controllers/departmentController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createDepartment);
router.get('/', protect, getDepartments);
router.get('/:id', protect, getDepartmentById);
router.put('/:id', protect, updateDepartment);
router.delete('/:id', protect, deleteDepartment);

module.exports = router;
