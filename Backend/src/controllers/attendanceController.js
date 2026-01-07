const Attendance = require('../models/attendanceModel');
const Employee = require('../models/employeeModel');

const attendanceController = {
    markAttendance: async (req, res) => {
        try {
            const { employee_id, selfie, latitude, longitude, ip_address } = req.body;
            const userId = req.user.id; // From auth middleware
            const today = new Date().toISOString().split('T')[0];

            // Check if already marked for today
            const existingRecord = await Attendance.findByEmployeeAndDate(employee_id, today, userId);
            if (existingRecord) {
                return res.status(400).json({ success: false, message: 'Attendance already marked for today' });
            }

            const currentTime = new Date();
            const checkInTime = currentTime.toTimeString().split(' ')[0]; // HH:MM:SS

            // Logic for late status (e.g., after 9:30 AM)
            const hour = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            let status = 'present';
            if (hour > 9 || (hour === 9 && minutes > 30)) {
                status = 'late';
            }

            await Attendance.create({
                employee_id,
                date: today,
                check_in: checkInTime,
                status,
                check_in_method: 'WiFi', // Can be dynamic
                ip_address,
                selfie,
                latitude,
                longitude
            }, userId);

            res.status(201).json({ success: true, message: 'Attendance marked successfully', status });
        } catch (error) {
            console.error('Error marking attendance:', error);
            res.status(500).json({ success: false, message: 'Error marking attendance' });
        }
    },

    checkOut: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const currentTime = new Date();
            const checkOutTime = currentTime.toTimeString().split(' ')[0];

            // Get check-in time to calculate work hours
            const record = await Attendance.findById(id, userId);

            if (!record) {
                return res.status(404).json({ success: false, message: 'Attendance record not found' });
            }

            // Calculate work hours
            let workHours = '0h 0m';
            if (record.check_in) {
                const checkInDate = new Date(`1970-01-01T${record.check_in}`);
                const checkOutDate = new Date(`1970-01-01T${checkOutTime}`);
                const diffMs = checkOutDate - checkInDate;
                if (diffMs > 0) {
                    const diffHrs = Math.floor(diffMs / 3600000);
                    const diffMins = Math.round((diffMs % 3600000) / 60000);
                    workHours = `${diffHrs}h ${diffMins}m`;
                }
            }

            await Attendance.updateCheckOut(id, {
                check_out: checkOutTime,
                work_hours: workHours,
                status: record.status
            }, userId);

            res.json({ success: true, message: 'Checked out successfully', workHours });
        } catch (error) {
            console.error('Error checking out:', error);
            res.status(500).json({ success: false, message: 'Error checking out' });
        }
    },


    getAllAttendance: async (req, res) => {
        try {
            const userId = req.user.id;
            const filters = {
                date: req.query.date,
                employee_id: req.query.employee_id,
                department_id: req.query.department_id,
                status: req.query.status
            };
            const attendance = await Attendance.findAll(userId, filters);
            res.json({ success: true, data: attendance });
        } catch (error) {
            console.error('Error fetching attendance:', error);
            res.status(500).json({ success: false, message: 'Error fetching attendance' });
        }
    },

    getEmployeeAttendance: async (req, res) => {
        try {
            const userId = req.user.id;
            const { employee_id } = req.params;
            const attendance = await Attendance.findAll(userId, { employee_id });
            const stats = await Attendance.getEmployeeStats(employee_id, userId);
            res.json({ success: true, data: attendance, stats });
        } catch (error) {
            console.error('Error fetching employee attendance:', error);
            res.status(500).json({ success: false, message: 'Error fetching employee attendance' });
        }
    },

    getDashboardStats: async (req, res) => {
        try {
            const userId = req.user.id;
            const today = new Date().toISOString().split('T')[0];
            const stats = await Attendance.getStats(userId, today);
            res.json({ success: true, data: stats });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({ success: false, message: 'Error fetching dashboard stats' });
        }
    }
};

module.exports = attendanceController;
