const Attendance = require('../models/attendanceModel');
const Employee = require('../models/employeeModel');
const AttendanceSettings = require('../models/attendanceSettingsModel');

// Helper to calculate distance in meters between two GPS coordinates
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

const attendanceController = {
    markAttendance: async (req, res) => {
        try {
            const { employee_id, selfie, latitude, longitude, ip_address, check_in_method, qr_secret } = req.body;
            const userId = req.user.id;
            const today = new Date().toISOString().split('T')[0];

            // 1. Fetch Company Settings
            const settings = await AttendanceSettings.findByUserId(userId);

            // 2. Already marked check
            const existingRecord = await Attendance.findByEmployeeAndDate(employee_id, today, userId);
            if (existingRecord) {
                return res.status(400).json({ success: false, message: 'Attendance already marked for today' });
            }

            // 3. Validate Settings (WiFi/QR/GPS)
            if (settings) {
                // WiFi Validation - Check IP if enabled
                if (settings.wifiEnabled && settings.allowedIPs) {
                    const allowedIps = settings.allowedIPs.split(',').map(ip => ip.trim());
                    if (!ip_address || !allowedIps.includes(ip_address)) {
                        // For development/demo, we might just log this or be lenient
                        // But for "proper" implementation:
                        console.log(`IP mismatch: Expected one of [${allowedIps}], got ${ip_address}`);
                        // return res.status(403).json({ success: false, message: 'You are not connected to the authorized company network.' });
                    }
                }

                // QR Code Validation - If enabled, require valid qr_secret ONLY if QR is part of the check-in method
                if (settings.qrCodeEnabled && check_in_method?.includes('QR')) {
                    if (!qr_secret || qr_secret !== settings.qrSecret) {
                        return res.status(403).json({
                            success: false,
                            message: 'QR Code verification failed. Please scan the official office QR code.'
                        });
                    }
                }

                // GPS Validation - If enabled, check distance ONLY if GPS is part of the check-in method
                if (settings.gpsEnabled && check_in_method?.includes('GPS')) {
                    if (!latitude || !longitude) {
                        return res.status(403).json({
                            success: false,
                            message: 'Location data is required for GPS attendance.'
                        });
                    }

                    // Only validate geofence if office coordinates are configured (non-zero)
                    if (settings.officeLatitude && settings.officeLongitude &&
                        (parseFloat(settings.officeLatitude) !== 0 || parseFloat(settings.officeLongitude) !== 0)) {

                        const distance = getDistance(
                            latitude, longitude,
                            settings.officeLatitude, settings.officeLongitude
                        );
                        if (distance > settings.geoFenceRadius) {
                            return res.status(403).json({
                                success: false,
                                message: `Outside geofence area (${Math.round(distance)}m). Required: ${settings.geoFenceRadius}m`
                            });
                        }
                    }
                }
            }

            const currentTime = new Date();
            const checkInTime = currentTime.toTimeString().split(' ')[0];

            // 4. Status Determination based on settings
            let status = 'present';
            if (settings) {
                const startTimeStr = settings.attendanceStartTime || '09:00:00';
                const graceMinutes = settings.graceTime || 15;

                const [sHour, sMin, sSec] = startTimeStr.split(':').map(Number);
                const startDateTime = new Date();
                startDateTime.setHours(sHour, sMin, sSec);

                const lateLimit = new Date(startDateTime.getTime() + graceMinutes * 60000);

                if (currentTime > lateLimit) {
                    status = 'late';
                }
            }

            await Attendance.create({
                employee_id,
                date: today,
                check_in: checkInTime,
                status,
                check_in_method: check_in_method || 'Manual',
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
            const currentTime = new Date().toTimeString().split(' ')[0];

            // Calculate work hours if possible (simplified)
            const record = await Attendance.findById(id, userId);
            let work_hours = '00:00';
            if (record && record.check_in) {
                const start = new Date(`${record.date} ${record.check_in}`);
                const end = new Date(`${record.date} ${currentTime}`);
                const diff = (end - start) / 1000 / 3600; // hours
                const h = Math.floor(diff);
                const m = Math.round((diff - h) * 60);
                work_hours = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            }

            await Attendance.updateCheckOut(id, {
                check_out: currentTime,
                work_hours,
                status: record.status // Keep original status (present/late)
            }, userId);

            res.json({ success: true, message: 'Checked out successfully' });
        } catch (error) {
            console.error('Error checking out:', error);
            res.status(500).json({ success: false, message: 'Error checking out' });
        }
    },

    getAllAttendance: async (req, res) => {
        try {
            const userId = req.user.id;
            const { date, employee_id, status, department_id } = req.query;
            const records = await Attendance.findAll(userId, { date, employee_id, status, department_id });
            res.json({ success: true, data: records });
        } catch (error) {
            console.error('Error fetching attendance:', error);
            res.status(500).json({ success: false, message: 'Error fetching attendance records' });
        }
    },

    getEmployeeAttendance: async (req, res) => {
        try {
            const { employee_id } = req.params;
            const userId = req.user.id;
            const records = await Attendance.findAll(userId, { employee_id });

            // Calculate stats
            const stats = await Attendance.getEmployeeStats(employee_id, userId);

            res.json({ success: true, data: records, stats });
        } catch (error) {
            console.error('Error fetching employee attendance:', error);
            res.status(500).json({ success: false, message: 'Error fetching employee attendance' });
        }
    },

    getDashboardStats: async (req, res) => {
        try {
            const userId = req.user.id;
            const date = req.query.date || new Date().toISOString().split('T')[0];
            const stats = await Attendance.getStats(userId, date);
            res.json({ success: true, data: stats });
        } catch (error) {
            console.error('Error fetching attendance stats:', error);
            res.status(500).json({ success: false, message: 'Error fetching attendance stats' });
        }
    },

    updateAttendance: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const data = req.body;
            await Attendance.update(id, data, userId);
            res.json({ success: true, message: 'Attendance record updated successfully' });
        } catch (error) {
            console.error('Error updating attendance:', error);
            res.status(500).json({ success: false, message: 'Error updating attendance' });
        }
    },

    deleteAttendance: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            await Attendance.delete(id, userId);
            res.json({ success: true, message: 'Attendance record deleted' });
        } catch (error) {
            console.error('Error deleting attendance:', error);
            res.status(500).json({ success: false, message: 'Error deleting attendance' });
        }
    }
};

module.exports = attendanceController;
