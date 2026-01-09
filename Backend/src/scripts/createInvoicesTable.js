const { pool } = require('../config/db');

const createInvoicesTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS invoices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            invoice_number VARCHAR(50) UNIQUE NOT NULL,
            client_id INT,
            user_id INT NOT NULL,
            client_name VARCHAR(255) NOT NULL,
            client_email VARCHAR(255),
            client_phone VARCHAR(50),
            client_address TEXT,
            invoice_date DATE NOT NULL,
            due_date DATE,
            items JSON,
            subtotal DECIMAL(15, 2),
            tax_rate DECIMAL(5, 2),
            tax_amount DECIMAL(15, 2),
            total_amount DECIMAL(15, 2) NOT NULL,
            paid_amount DECIMAL(15, 2) DEFAULT 0,
            balance_amount DECIMAL(15, 2) NOT NULL,
            status ENUM('Paid', 'Partial', 'Unpaid', 'Overdue', 'Cancelled') DEFAULT 'Unpaid',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
        );
    `;
    try {
        await pool.query(query);
        console.log('Invoices table created successfully');
    } catch (error) {
        console.error('Error creating invoices table:', error);
    }
    process.exit();
};

createInvoicesTable();
