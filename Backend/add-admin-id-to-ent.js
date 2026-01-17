const { pool } = require('./src/config/db');

async function migrate() {
    try {
        console.log('Adding admin_id to enterprises table...');
        try {
            await pool.query('ALTER TABLE enterprises ADD COLUMN admin_id INT AFTER id');
        } catch (e) {
            console.log('Column might already exist, continuing...');
        }

        // Try to backfill for existing ones based on email
        console.log('Backfilling admin_id based on email...');
        await pool.query('UPDATE enterprises e JOIN users u ON e.email = u.email SET e.admin_id = u.id WHERE e.admin_id IS NULL');

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
