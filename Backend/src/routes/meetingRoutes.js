const express = require('express');
const router = express.Router();
const {
    getMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting
} = require('../controllers/meetingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('meeting_view'), getMeetings);
router.post('/', protect, authorize('meeting_create'), createMeeting);
router.put('/:id', protect, authorize('meeting_edit'), updateMeeting);
router.delete('/:id', protect, authorize('meeting_delete'), deleteMeeting);

module.exports = router;
