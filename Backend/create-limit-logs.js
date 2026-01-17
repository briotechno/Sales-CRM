const { pool } = require('./src/config/db');

async function migrate() {
    try {
        console.log('Creating limit_logs table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS limit_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                enterprise_id INT NOT NULL,
                user_id INT,
                limit_type VARCHAR(50) NOT NULL, -- 'leads', 'users', 'storage'
                attempted_value VARCHAR(255),
                limit_value INT,
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table limit_logs created successfully!');

        // Also ensure subscriptions table has what we need
        // actually existing subscriptions table has leads, users (employees), storage.

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
