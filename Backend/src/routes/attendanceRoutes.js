const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);


router.post('/mark', attendanceController.markAttendance);
router.put('/checkout/:id', attendanceController.checkOut);
router.get('/all', attendanceController.getAllAttendance);
router.get('/employee/:employee_id', attendanceController.getEmployeeAttendance);
router.get('/stats', attendanceController.getDashboardStats);

module.exports = router;
