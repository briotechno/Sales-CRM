const express = require('express');
const router = express.Router();
const {
    createLeaveType, getLeaveTypes, updateLeaveType, deleteLeaveType,
    createHoliday, getHolidays, updateHoliday, deleteHoliday,
    applyLeave, getLeaveRequests, updateLeaveStatus, deleteLeaveRequest
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');

// Leave Types (Manage Leave)
router.post('/types', protect, createLeaveType);
router.get('/types', protect, getLeaveTypes);
router.put('/types/:id', protect, updateLeaveType);
router.delete('/types/:id', protect, deleteLeaveType);

// Holidays
router.post('/holidays', protect, createHoliday);
router.get('/holidays', protect, getHolidays);
router.put('/holidays/:id', protect, updateHoliday);
router.delete('/holidays/:id', protect, deleteHoliday);

// Leave Requests (All Leave)
router.post('/apply', protect, applyLeave);
router.get('/all', protect, getLeaveRequests);
router.patch('/status/:id', protect, updateLeaveStatus);
router.delete('/requests/:id', protect, deleteLeaveRequest);

module.exports = router;
