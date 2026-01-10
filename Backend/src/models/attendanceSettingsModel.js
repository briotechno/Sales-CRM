const { pool } = require('../config/db');

const AttendanceSettings = {
    findByUserId: async (userId) => {
        const [rows] = await pool.query('SELECT * FROM attendance_settings WHERE user_id = ?', [userId]);
        return rows[0];
    },

    update: async (userId, data) => {
        // Define allowed fields to prevent "Unknown column" errors
        const allowedFields = [
            'attendanceStartTime', 'attendanceEndTime', 'graceTime',
            'halfDayStartTime', 'halfDayEndTime', 'halfDayMinHours',
            'fullDayMinHours', 'lateMarkAfter', 'autoCheckOut',
            'autoCheckOutTime', 'wifiEnabled', 'qrCodeEnabled', 'qrSecret',
            'manualEnabled', 'biometricEnabled', 'gpsEnabled',
            'wifiSSID', 'wifiPassword', 'allowedIPs',
            'officeLatitude', 'officeLongitude', 'geoFenceRadius',
            'breakEnabled', 'breakDuration', 'maxBreaks',
            'deductBreakTime', 'casualLeave', 'sickLeave',
            'paidLeave', 'unpaidLeave', 'maternityLeave', 'paternityLeave',
            'bereavementLeave', 'marriageLeave', 'lateArrivalNotification',
            'earlyDepartureNotification', 'absentNotification',
            'overtimeNotification', 'emailNotifications',
            'smsNotifications', 'weekendDays', 'publicHolidays', 'overtimeEnabled',
            'overtimeStartAfter', 'overtimeRate', 'maxOvertimeHours',
            'multipleShiftsEnabled', 'defaultShift'
        ];

        const updateData = {};
        const numericFields = [
            'graceTime', 'halfDayMinHours', 'fullDayMinHours', 'lateMarkAfter',
            'geoFenceRadius', 'breakDuration', 'maxBreaks', 'casualLeave',
            'sickLeave', 'paidLeave', 'unpaidLeave', 'maternityLeave',
            'paternityLeave', 'bereavementLeave', 'marriageLeave', 'maxOvertimeHours', 'overtimeRate'
        ];

        Object.keys(data).forEach(key => {
            if (allowedFields.includes(key)) {
                let value = data[key];

                // Handle empty strings for numeric fields
                if (numericFields.includes(key) && value === "") {
                    value = null;
                }

                // Stringify arrays/objects for JSON columns
                if (typeof value === 'object' && value !== null) {
                    value = JSON.stringify(value);
                }
                updateData[key] = value;
            }
        });

        const fields = Object.keys(updateData);
        const values = Object.values(updateData);

        if (fields.length === 0) return;

        const setClause = fields.map(field => `\`${field}\` = ?`).join(', ');

        const existing = await AttendanceSettings.findByUserId(userId);

        if (existing) {
            await pool.query(
                `UPDATE attendance_settings SET ${setClause} WHERE user_id = ?`,
                [...values, userId]
            );
        } else {
            const columns = ['user_id', ...fields];
            const placeholders = columns.map(() => '?').join(', ');
            await pool.query(
                `INSERT INTO attendance_settings (\`${columns.join('`, `')}\`) VALUES (${placeholders})`,
                [userId, ...values]
            );
        }
    }
};

module.exports = AttendanceSettings;
