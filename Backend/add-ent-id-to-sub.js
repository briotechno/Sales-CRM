const { pool } = require('./src/config/db');

async function migrate() {
    try {
        console.log('Adding enterprise_id to subscriptions table...');
        try {
            await pool.query('ALTER TABLE subscriptions ADD COLUMN enterprise_id INT AFTER id');
        } catch (e) {
            console.log('Column might already exist, continuing...');
        }

        // Try to backfill
        console.log('Backfilling enterprise_id based on enterprise_name...');
        await pool.query('UPDATE subscriptions s JOIN enterprises e ON s.enterprise_name = e.businessName SET s.enterprise_id = e.id WHERE s.enterprise_id IS NULL');

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
