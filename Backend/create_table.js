const { pool } = require('./src/config/db');

async function createTable() {
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

    try {
        await pool.query(sql);
        console.log("Table 'channel_configs' created successfully or already exists.");
        process.exit(0);
    } catch (error) {
        console.error("Error creating table:", error);
        process.exit(1);
    }
}

createTable();
