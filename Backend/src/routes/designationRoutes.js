const express = require('express');
const router = express.Router();
const {
    createDesignation,
    getDesignations,
    getDesignationById,
    updateDesignation,
    deleteDesignation
} = require('../controllers/designationController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createDesignation);
router.get('/', protect, getDesignations);
router.get('/:id', protect, getDesignationById);
router.put('/:id', protect, updateDesignation);
router.delete('/:id', protect, deleteDesignation);

module.exports = router;
