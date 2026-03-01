const { pool } = require('./src/config/db');

async function migrate() {
    try {
        console.log('Starting migration: Adding max_reassignment_limit to lead_assignment_settings...');

        await pool.query(`
            ALTER TABLE lead_assignment_settings 
            ADD COLUMN IF NOT EXISTS max_reassignment_limit INT DEFAULT 5;
        `);

        console.log('Migration successful: max_reassignment_limit added.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrate();
