const { pool } = require('../config/db');

const syncDatabase = async () => {
    try {
        const sql = `
        CREATE TABLE IF NOT EXISTS channel_configs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            channel_type ENUM('meta', 'justdial', 'indiamart') NOT NULL,
            account_name VARCHAR(255) NOT NULL,
            api_key TEXT,
            config_data JSON,
            status ENUM('active', 'inactive') DEFAULT 'active',
            last_sync_at DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        `;
        await pool.query(sql);

        const goalsSql = `
        CREATE TABLE IF NOT EXISTS goals (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            employee_id INT,
            team_id INT,
            goal_title VARCHAR(255) NOT NULL,
            goal_type ENUM('calls', 'revenue', 'meetings', 'leads', 'deals_won', 'followups', 'proposals', 'demos') NOT NULL,
            target_value DECIMAL(15,2) NOT NULL,
            period ENUM('daily', 'weekly', 'monthly', 'quarterly', 'yearly') NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            reward VARCHAR(255),
            description TEXT,
            status ENUM('active', 'achieved', 'failed') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        `;
        await pool.query(goalsSql);

        // Ensure team_id and other updates are reflected even if table exists
        try {
            await pool.query("ALTER TABLE goals ADD COLUMN team_id INT AFTER employee_id");
        } catch (e) {
            // Probably column already exists, safe to ignore
        }

        try {
            await pool.query("ALTER TABLE goals ADD COLUMN reward VARCHAR(255) AFTER end_date");
        } catch (e) {
            // Probably column already exists, safe to ignore
        }

        try {
            await pool.query("ALTER TABLE goals ADD COLUMN description TEXT AFTER reward");
        } catch (e) {
            // Probably column already exists, safe to ignore
        }

        try {
            await pool.query("ALTER TABLE goals MODIFY COLUMN goal_type ENUM('calls', 'revenue', 'meetings', 'leads', 'deals_won', 'followups', 'proposals', 'demos') NOT NULL");
        } catch (e) {
            // Also safe to ignore
        }

        try {
            await pool.query("ALTER TABLE goals ADD COLUMN priority ENUM('low', 'medium', 'high') DEFAULT 'medium' AFTER description");
        } catch (e) {
            // Already exists
        }

        const visitorSql = `
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
            user_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );
        `;
        await pool.query(visitorSql);

        console.log('Database synced: channel_configs, goals, and visitors tables are ready.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

module.exports = syncDatabase;
