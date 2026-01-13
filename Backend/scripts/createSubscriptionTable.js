const { pool } = require('../src/config/db');

async function createSubscriptionTable() {
    try {
        await pool.query(`DROP TABLE IF EXISTS subscriptions`);

        await pool.query(`
            CREATE TABLE subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                enterprise_name VARCHAR(255) NOT NULL,
                plan ENUM('Starter', 'Professional', 'Enterprise') NOT NULL,
                status ENUM('Active', 'Inactive', 'Trial', 'Expired') DEFAULT 'Active',
                users INT DEFAULT 0,
                amount DECIMAL(10, 2) DEFAULT 0.00,
                billingCycle ENUM('Monthly', 'Yearly') DEFAULT 'Monthly',
                onboardingDate DATE NOT NULL,
                expiryDate DATE,
                leads VARCHAR(50) DEFAULT '0',
                storage VARCHAR(50) DEFAULT '0',
                features JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Subscriptions table created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating subscriptions table:', error);
        process.exit(1);
    }
}

createSubscriptionTable();
