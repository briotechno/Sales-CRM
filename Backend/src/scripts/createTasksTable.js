const { pool } = require('../config/db');

const createTasksTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
                due_date DATE NOT NULL,
                due_time TIME NOT NULL,
                category VARCHAR(100) DEFAULT 'General',
                completed TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await pool.query(query);
        console.log('Tasks table created or already exists.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating tasks table:', error);
        process.exit(1);
    }
};

createTasksTable();
