const { pool } = require('../src/config/db');

async function createTables() {
    try {
        console.log('Starting table creation...');

        // 1. enterprises
        await pool.query(`
            CREATE TABLE IF NOT EXISTS enterprises (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(255),
                lastName VARCHAR(255),
                email VARCHAR(255),
                mobileNumber VARCHAR(20),
                businessName VARCHAR(255),
                businessType VARCHAR(100),
                gst VARCHAR(50),
                address TEXT,
                plan VARCHAR(100) DEFAULT 'Starter',
                status VARCHAR(50) DEFAULT 'Active',
                onboardingDate DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Checked/Created table: enterprises');

        // 2. plans
        await pool.query(`
            CREATE TABLE IF NOT EXISTS plans (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                description TEXT,
                price DECIMAL(10, 2),
                default_users INT DEFAULT 0,
                default_leads INT DEFAULT 0,
                default_storage VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Checked/Created table: plans');

        // 3. product_keys
        await pool.query(`
            CREATE TABLE IF NOT EXISTS product_keys (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_key VARCHAR(255) UNIQUE,
                enterprise VARCHAR(255),
                plan VARCHAR(100),
                status VARCHAR(50) DEFAULT 'Pending',
                users INT DEFAULT 0,
                validity VARCHAR(100),
                generatedOn DATETIME,
                expiresOn DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Checked/Created table: product_keys');

        // 4. subscriptions
        await pool.query(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                enterprise_name VARCHAR(255),
                plan VARCHAR(100),
                status VARCHAR(50) DEFAULT 'Active',
                users INT DEFAULT 0,
                amount DECIMAL(10, 2) DEFAULT 0.00,
                billingCycle VARCHAR(50) DEFAULT 'Monthly',
                onboardingDate DATETIME,
                expiryDate DATETIME,
                leads INT DEFAULT 0,
                storage VARCHAR(50),
                features JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Checked/Created table: subscriptions');

        console.log('All missing tables created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    }
}

createTables();
