const { pool } = require('./src/config/db');

async function runMigration() {
    try {
        console.log('Running migration: add_description_to_tasks...');
        const query = "ALTER TABLE tasks ADD COLUMN description TEXT AFTER title";
        try {
            await pool.query(query);
            console.log("✓ Executed: " + query);
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME' || error.message.includes('Duplicate column name')) {
                console.log("  Column already exists, skipping...");
            } else {
                console.error("✗ Error: " + error.message);
            }
        }
        console.log("\n✓ Migration completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
