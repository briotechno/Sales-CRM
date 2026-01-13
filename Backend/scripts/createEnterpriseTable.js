const { pool } = require('../src/config/db');

async function createEnterpriseTable() {
    try {
        await pool.query(`DROP TABLE IF EXISTS enterprises`);

        await pool.query(`
            CREATE TABLE enterprises (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(100) NOT NULL,
                lastName VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                mobileNumber VARCHAR(20) NOT NULL,
                businessName VARCHAR(255) NOT NULL,
                businessType VARCHAR(100) NOT NULL,
                gst VARCHAR(50),
                address TEXT NOT NULL,
                plan ENUM('Starter', 'Professional', 'Enterprise') DEFAULT 'Starter',
                status ENUM('Active', 'Inactive', 'Trial') DEFAULT 'Active',
                onboardingDate DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Enterprise table created successfully without users field');
        process.exit(0);
    } catch (error) {
        console.error('Error creating enterprise table:', error);
        process.exit(1);
    }
}

createEnterpriseTable();
