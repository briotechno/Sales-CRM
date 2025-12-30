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
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('icon'), createDepartment);
router.get('/', protect, getDepartments);
router.get('/:id', protect, getDepartmentById);
router.put('/:id', protect, upload.single('icon'), updateDepartment);
router.delete('/:id', protect, deleteDepartment);

module.exports = router;
