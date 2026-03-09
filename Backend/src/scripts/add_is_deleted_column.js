const { pool } = require('../config/db');

async function migrate() {
    try {
        console.log('Starting migration: Adding is_deleted to leads table...');

        // Check if column exists
        const [columns] = await pool.query("SHOW COLUMNS FROM leads LIKE 'is_deleted'");

        if (columns.length === 0) {
            await pool.query("ALTER TABLE leads ADD COLUMN is_deleted TINYINT(1) DEFAULT 0");
            console.log('Column is_deleted added successfully.');
        } else {
            console.log('Column is_deleted already exists.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrate();
