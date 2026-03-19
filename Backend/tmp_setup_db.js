const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

async function setup() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
                icon VARCHAR(50),
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Notifications table created successfully');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
setup();
