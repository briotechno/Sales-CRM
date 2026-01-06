const { pool } = require('../config/db');

const createExpensesTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS expenses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                category VARCHAR(100) NOT NULL,
                date DATE NOT NULL,
                receipt_url VARCHAR(255),
                status ENUM('approved', 'pending', 'rejected') DEFAULT 'pending',
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await pool.query(query);
        console.log('Expenses table created or already exists.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating expenses table:', error);
        process.exit(1);
    }
};

createExpensesTable();
