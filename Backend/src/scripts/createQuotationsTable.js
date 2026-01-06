const { pool } = require('../config/db');

const createQuotationsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS quotations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            quotation_id VARCHAR(50) UNIQUE NOT NULL,
            client_name VARCHAR(255) NOT NULL,
            company_name VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(50),
            quotation_date DATE NOT NULL,
            valid_until DATE,
            currency VARCHAR(10) DEFAULT 'INR',
            line_items JSON,
            subtotal DECIMAL(15, 2),
            tax DECIMAL(5, 2),
            discount DECIMAL(15, 2),
            total_amount DECIMAL(15, 2) NOT NULL,
            payment_terms TEXT,
            notes TEXT,
            status ENUM('Draft', 'Pending', 'Approved', 'Rejected') DEFAULT 'Draft',
            user_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
        console.log('Quotations table created successfully');
    } catch (error) {
        console.error('Error creating quotations table:', error);
    }
    process.exit();
};

createQuotationsTable();
