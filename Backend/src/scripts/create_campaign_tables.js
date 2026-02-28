const { pool } = require('../config/db');

async function createCampaignTables() {
    try {
        console.log('Creating campaigns table...');
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
                timing_type ENUM('Any Time', 'Specific Window') DEFAULT 'Any Time',
                lead_limit_type ENUM('Unlimited', 'Fixed Limit') DEFAULT 'Unlimited',
                leads_per_day INT DEFAULT 0,
                audience_type ENUM('Teams', 'Individuals') DEFAULT 'Teams',
                status ENUM('active', 'paused', 'scheduled', 'ended') DEFAULT 'active',
                leads_generated INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX (user_id),
                INDEX (source)
            )
        `);

        console.log('Creating campaign_audience table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS campaign_audience (
                id INT AUTO_INCREMENT PRIMARY KEY,
                campaign_id INT NOT NULL,
                employee_id INT NOT NULL,
                max_balance_override INT DEFAULT NULL,
                daily_limit_override INT DEFAULT NULL,
                is_unlimited BOOLEAN DEFAULT FALSE,
                is_investigation_officer BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
                INDEX (employee_id)
            )
        `);

        console.log('Campaign tables created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating campaign tables:', error);
        process.exit(1);
    }
}

createCampaignTables();
