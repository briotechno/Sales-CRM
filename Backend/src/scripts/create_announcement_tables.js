const { pool } = require('../config/db');

const createTables = async () => {
    try {
        console.log('Creating announcement_categories table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS announcement_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                user_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_category_user (name, user_id)
            )
        `);
        console.log('announcement_categories table created.');

        console.log('Creating announcements table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS announcements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                author VARCHAR(255),
                category VARCHAR(255),
                date DATE,
                user_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('announcements table created.');

        process.exit(0);
    } catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    }
};

createTables();
