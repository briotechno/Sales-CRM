const { pool } = require('../config/db');

async function createVisitorTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS visitors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                visitor_name VARCHAR(255) NOT NULL,
                phone_number VARCHAR(20) NOT NULL,
                email VARCHAR(255),
                company_name VARCHAR(255),
                visitor_type VARCHAR(100),
                purpose TEXT,
                host_employee_ids JSON,
                visit_date DATE,
                check_in_time TIME,
                check_out_time TIME,
                status VARCHAR(50) DEFAULT 'Waiting',
                id_proof_type VARCHAR(100),
                id_proof_number VARCHAR(100),
                remarks TEXT,
                send_reminder BOOLEAN DEFAULT 0,
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✓ visitors table created successfully');
    } catch (error) {
        console.error('Error creating visitors table:', error);
    }
}

module.exports = createVisitorTable;
