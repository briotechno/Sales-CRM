const { pool } = require('../config/db');

const createClientTable = async () => {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS clients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type ENUM('person', 'organization') NOT NULL DEFAULT 'person',
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(50),
                company_name VARCHAR(255),
                position VARCHAR(255),
                birthday DATE,
                source VARCHAR(100),
                industry VARCHAR(100),
                website VARCHAR(255),
                number_of_employees INT,
                tax_id VARCHAR(100),
                address TEXT,
                city VARCHAR(100),
                state VARCHAR(100),
                zip_code VARCHAR(50),
                country VARCHAR(100),
                status VARCHAR(50) DEFAULT 'active',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;

        await pool.query(createTableQuery);
        console.log('Clients table created successfully');
    } catch (error) {
        console.error('Error creating clients table:', error);
    } finally {
        process.exit();
    }
};

createClientTable();
