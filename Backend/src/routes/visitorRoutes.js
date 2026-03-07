const express = require('express');
const router = express.Router();
const {
    createVisitor,
    getVisitors,
    getVisitorById,
    updateVisitor,
    deleteVisitor,
    getDueVisitors
} = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createVisitor);
router.get('/', protect, getVisitors);
router.get('/due-visitors', protect, getDueVisitors);
router.get('/:id', protect, getVisitorById);
router.put('/:id', protect, updateVisitor);
router.delete('/:id', protect, deleteVisitor);

module.exports = router;
