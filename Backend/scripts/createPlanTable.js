const { pool } = require('../src/config/db');

async function createPlanTable() {
    try {
        await pool.query(`DROP TABLE IF EXISTS plans`);

        await pool.query(`
            CREATE TABLE plans (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                price DECIMAL(10, 2) DEFAULT 0.00,
                default_users INT DEFAULT 0,
                default_leads INT DEFAULT 0,
                default_storage INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Seed some initial plans matching the Packages.jsx
        const plans = [
            ['Starter', 'Basic CRM Features', 999.00, 5, 1000, 10],
            ['Professional', 'Advanced CRM Features', 2499.00, 15, 5000, 50],
            ['Enterprise', 'All Features + Dedicated Support', 9999.00, 50, 25000, 250],
            ['Startup', 'Standard CRM Features', 1499.00, 8, 2000, 25],
            ['Growth', 'Advanced Features + Automation', 3499.00, 20, 10000, 75],
            ['Business', 'All Professional Features', 4999.00, 30, 20000, 100]
        ];

        for (const plan of plans) {
            await pool.query(
                'INSERT INTO plans (name, description, price, default_users, default_leads, default_storage) VALUES (?, ?, ?, ?, ?, ?)',
                plan
            );
        }

        console.log('Plans table created and seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating plans table:', error);
        process.exit(1);
    }
}

createPlanTable();
