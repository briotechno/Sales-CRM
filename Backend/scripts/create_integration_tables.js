const { pool } = require('../src/config/db');

async function createTables() {
    try {
        console.log('Starting integration tables creation...');

        // CRM Forms Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS crm_forms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                form_name VARCHAR(255) NOT NULL,
                form_slug VARCHAR(255) NOT NULL UNIQUE,
                fields JSON,
                settings JSON,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('crm_forms table checked/created');

        // Google Sheets Configs Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS google_sheets_configs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                sheet_name VARCHAR(255) NOT NULL,
                spreadsheet_id VARCHAR(255) NOT NULL,
                sheet_id VARCHAR(255),
                credentials_json TEXT, -- Store service account JSON or encrypted credentials
                field_mapping JSON,
                sync_frequency VARCHAR(50) DEFAULT 'manual',
                last_sync_at TIMESTAMP NULL,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('google_sheets_configs table checked/created');

        // Lead Sync Logs Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS lead_sync_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                channel_type VARCHAR(50) NOT NULL,
                reference_id INT, -- form_id or sheet_config_id
                status ENUM('success', 'error') NOT NULL,
                message TEXT,
                raw_data JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('lead_sync_logs table checked/created');

        console.log('All integration tables created successfully.');
    } catch (error) {
        console.error('Error creating integration tables:', error);
    } finally {
        process.exit();
    }
}

createTables();
