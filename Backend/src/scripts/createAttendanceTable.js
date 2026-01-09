const { pool } = require('../config/db');

const createAttendanceTable = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        user_id INT NOT NULL,
        date DATE NOT NULL,
        check_in TIME NOT NULL,
        check_out TIME,
        status ENUM('present', 'absent', 'late', 'half-day', 'leave') DEFAULT 'present',
        work_hours VARCHAR(50),
        check_in_method VARCHAR(50),
        ip_address VARCHAR(50),
        selfie TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);
        console.log('Attendance table created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating attendance table:', error);
        process.exit(1);
    }
};

createAttendanceTable();
