const { pool } = require('../config/db');

async function createLeadResourcesTables() {
    try {
        // Create lead_notes table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS lead_notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                lead_id INT NOT NULL,
                user_id INT NOT NULL,
                title VARCHAR(255),
                description TEXT,
                files JSON,
                created_by VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
                INDEX idx_lead_id (lead_id),
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✓ lead_notes table created successfully');

        // Create lead_calls table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS lead_calls (
                id INT AUTO_INCREMENT PRIMARY KEY,
                lead_id INT NOT NULL,
                user_id INT NOT NULL,
                status VARCHAR(50),
                call_date DATETIME,
                note TEXT,
                follow_task BOOLEAN DEFAULT 0,
                created_by VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
                INDEX idx_lead_id (lead_id),
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✓ lead_calls table created successfully');

        // Create lead_files table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS lead_files (
                id INT AUTO_INCREMENT PRIMARY KEY,
                lead_id INT NOT NULL,
                user_id INT NOT NULL,
                name VARCHAR(255),
                path VARCHAR(500),
                type VARCHAR(100),
                size BIGINT,
                description TEXT,
                uploaded_by VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
                INDEX idx_lead_id (lead_id),
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✓ lead_files table created successfully');

        // Create lead_meetings table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS lead_meetings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                lead_id INT NOT NULL,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                meeting_date DATE,
                meeting_time TIME,
                attendees JSON,
                created_by VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
                INDEX idx_lead_id (lead_id),
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✓ lead_meetings table created successfully');

        console.log('\n✓ All lead resource tables created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    }
}

createLeadResourcesTables();
