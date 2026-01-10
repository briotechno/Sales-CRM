const { pool } = require('../config/db');

const createTables = async () => {
    try {
        console.log('Creating tables...');

        // Pipelines Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pipelines (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                description TEXT,
                user_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('pipelines table created/verified.');

        // Pipeline Stages Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pipeline_stages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                pipeline_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                probability INT NOT NULL DEFAULT 0,
                is_final BOOLEAN DEFAULT FALSE,
                stage_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (pipeline_id) REFERENCES pipelines(id) ON DELETE CASCADE
            )
        `);
        console.log('pipeline_stages table created/verified.');

        // Leads Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS leads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                lead_id VARCHAR(50),
                name VARCHAR(255) NOT NULL,
                mobile_number VARCHAR(20) NOT NULL,
                email VARCHAR(255),
                value DECIMAL(15, 2) DEFAULT 0,
                pipeline_id INT NOT NULL,
                stage_id INT NOT NULL,
                status ENUM('Open', 'Won', 'Lost') DEFAULT 'Open',
                type VARCHAR(50) DEFAULT 'Person',
                tag VARCHAR(50) DEFAULT 'Not Contacted',
                location VARCHAR(255),
                user_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (pipeline_id) REFERENCES pipelines(id),
                FOREIGN KEY (stage_id) REFERENCES pipeline_stages(id)
            )
        `);
        console.log('leads table created/verified.');

        process.exit(0);
    } catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    }
};

createTables();
