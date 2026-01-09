const AttendanceSettings = require('../models/attendanceSettingsModel');

const attendanceSettingsController = {
    getSettings: async (req, res) => {
        try {
            const userId = req.user.id;
            let settings = await AttendanceSettings.findByUserId(userId);

            // If no settings found, return default-like structure or empty
            if (!settings) {
                return res.json({ success: true, data: {} });
            }

            res.json({ success: true, data: settings });
        } catch (error) {
            console.error('Error fetching attendance settings:', error);
            res.status(500).json({ success: false, message: 'Error fetching attendance settings' });
        }
    },

    updateSettings: async (req, res) => {
        try {
            const userId = req.user.id;
            const data = req.body;

            await AttendanceSettings.update(userId, data);
            res.json({ success: true, message: 'Attendance settings updated successfully' });
        } catch (error) {
            console.error('Error updating attendance settings:', error);
            res.status(500).json({ success: false, message: 'Error updating attendance settings' });
        }
    }
};

module.exports = attendanceSettingsController;
