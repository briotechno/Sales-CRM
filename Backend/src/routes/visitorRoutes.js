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
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('visitor_create'), createVisitor);
router.get('/', protect, authorize('visitor_view'), getVisitors);
router.get('/due-visitors', protect, authorize('visitor_view'), getDueVisitors);
router.get('/:id', protect, authorize('visitor_view'), getVisitorById);
router.put('/:id', protect, authorize('visitor_edit'), updateVisitor);
router.delete('/:id', protect, authorize('visitor_delete'), deleteVisitor);

module.exports = router;
