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
        console.log('Database synced: channel_configs table is ready.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

module.exports = syncDatabase;
