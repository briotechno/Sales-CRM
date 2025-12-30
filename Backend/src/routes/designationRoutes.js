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
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('image'), createDesignation);
router.get('/', protect, getDesignations);
router.get('/:id', protect, getDesignationById);
router.put('/:id', protect, upload.single('image'), updateDesignation);
router.delete('/:id', protect, deleteDesignation);

module.exports = router;
