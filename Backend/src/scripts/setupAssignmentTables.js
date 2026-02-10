const { pool } = require('../config/db');

const setupAssignmentTables = async () => {
    try {
        console.log('Setting up assignment tables...');

        // 1. Lead Assignment Settings Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS lead_assignment_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                mode ENUM('manual', 'auto') DEFAULT 'manual',
                leads_per_employee_per_day INT DEFAULT 10,
                max_active_leads_balance INT DEFAULT 5,
                revert_time_hours INT DEFAULT 24,
                load_balancing_strategy ENUM('round_robin', 'performance_based') DEFAULT 'round_robin',
                priority_handling BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_user (user_id)
            )
        `);
        console.log('lead_assignment_settings table ensured.');

        // 2. Lead Assignment Logs Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS lead_assignment_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                lead_id INT NOT NULL,
                employee_id INT NOT NULL,
                assigned_by VARCHAR(50) DEFAULT 'system',
                assignment_type ENUM('manual', 'auto') DEFAULT 'manual',
                reassigned_from INT,
                reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('lead_assignment_logs table ensured.');

        // 3. Add column to leads table if it doesn't exist for tracking assignment time
        const [leadsColumns] = await pool.query('SHOW COLUMNS FROM leads');
        const hasAssignedAt = leadsColumns.some(col => col.Field === 'assigned_at');
        if (!hasAssignedAt) {
            await pool.query('ALTER TABLE leads ADD COLUMN assigned_at TIMESTAMP NULL');
            console.log('assigned_at column added to leads table.');
        }

        console.log('Assignment tables setup complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up assignment tables:', error);
        process.exit(1);
    }
};

setupAssignmentTables();
