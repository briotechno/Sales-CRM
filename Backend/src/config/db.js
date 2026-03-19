const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3307,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // timezone: 'local',
    dateStrings: false
});

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL Connected...');
        
        // Create notifications table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                user_type ENUM('user', 'employee') NOT NULL DEFAULT 'employee',
                type VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
                icon VARCHAR(50),
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Notifications table checked/created.');
        
        connection.release();
    } catch (error) {
        console.error('MySQL connection error:', error);
    }
};

module.exports = { pool, connectDB };
