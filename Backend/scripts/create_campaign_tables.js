const { pool } = require('../src/config/db');

async function createTables() {
    try {
        // 1. Create Campaigns table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS campaigns (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                source VARCHAR(100) NOT NULL,
                start_date DATE NOT NULL,
                start_time TIME NOT NULL,
                end_date DATE NOT NULL,
                end_time TIME NOT NULL,
                timing_type VARCHAR(100) NOT NULL,
                lead_limit_type VARCHAR(50) NOT NULL,
                leads_per_day INT DEFAULT 0,
                audience_type VARCHAR(50) NOT NULL,
                status ENUM('active', 'scheduled', 'paused', 'completed') DEFAULT 'scheduled',
                leads_generated INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Campaigns table created or already exists.');

        // 2. Create Campaign Audience table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS campaign_audience (
                id INT AUTO_INCREMENT PRIMARY KEY,
                campaign_id INT NOT NULL,
                employee_id INT NOT NULL,
                max_balance_override INT DEFAULT NULL,
                daily_limit_override INT DEFAULT NULL,
                is_unlimited BOOLEAN DEFAULT FALSE,
                is_investigation_officer BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
            )
        `);
        console.log('Campaign Audience table created or already exists.');

        process.exit(0);
    } catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    }
}

createTables();
