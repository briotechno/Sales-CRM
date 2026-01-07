const { pool } = require('../config/db');

const createAttendanceSettingsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        attendanceStartTime TIME DEFAULT '09:00:00',
        attendanceEndTime TIME DEFAULT '18:00:00',
        graceTime INT DEFAULT 15,
        halfDayStartTime TIME DEFAULT '09:00:00',
        halfDayEndTime TIME DEFAULT '13:00:00',
        halfDayMinHours INT DEFAULT 4,
        fullDayMinHours INT DEFAULT 8,
        lateMarkAfter INT DEFAULT 15,
        autoCheckOut BOOLEAN DEFAULT TRUE,
        autoCheckOutTime TIME DEFAULT '19:00:00',
        wifiEnabled BOOLEAN DEFAULT TRUE,
        qrCodeEnabled BOOLEAN DEFAULT TRUE,
        manualEnabled BOOLEAN DEFAULT TRUE,
        biometricEnabled BOOLEAN DEFAULT FALSE,
        gpsEnabled BOOLEAN DEFAULT FALSE,
        wifiSSID VARCHAR(255),
        wifiPassword VARCHAR(255),
        allowedIPs TEXT,
        officeLatitude DECIMAL(10, 8),
        officeLongitude DECIMAL(11, 8),
        geoFenceRadius INT DEFAULT 100,
        breakEnabled BOOLEAN DEFAULT TRUE,
        breakDuration INT DEFAULT 60,
        maxBreaks INT DEFAULT 2,
        deductBreakTime BOOLEAN DEFAULT TRUE,
        casualLeave INT DEFAULT 12,
        sickLeave INT DEFAULT 10,
        paidLeave INT DEFAULT 15,
        unpaidLeave INT DEFAULT 5,
        lateArrivalNotification BOOLEAN DEFAULT TRUE,
        earlyDepartureNotification BOOLEAN DEFAULT TRUE,
        absentNotification BOOLEAN DEFAULT TRUE,
        overtimeNotification BOOLEAN DEFAULT TRUE,
        emailNotifications BOOLEAN DEFAULT TRUE,
        smsNotifications BOOLEAN DEFAULT FALSE,
        weekendDays JSON,
        publicHolidays JSON,
        overtimeEnabled BOOLEAN DEFAULT TRUE,
        overtimeStartAfter TIME DEFAULT '18:00:00',
        overtimeRate DECIMAL(3, 2) DEFAULT 1.50,
        maxOvertimeHours INT DEFAULT 4,
        multipleShiftsEnabled BOOLEAN DEFAULT FALSE,
        defaultShift VARCHAR(50) DEFAULT 'morning',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY (user_id)
      )
    `);
    console.log('Attendance settings table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating attendance settings table:', error);
    process.exit(1);
  }
};

createAttendanceSettingsTable();
