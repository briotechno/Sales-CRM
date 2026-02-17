const { pool } = require('./src/config/db');

async function runMigration() {
    try {
        console.log('Running migration: add_call_reason_and_remarks...');

        const alterQueries = [
            "ALTER TABLE leads ADD COLUMN not_connected_reason VARCHAR(255)",
            "ALTER TABLE leads ADD COLUMN call_remarks TEXT"
        ];

        for (const query of alterQueries) {
            try {
                await pool.query(query);
                console.log(`✓ Executed: ${query}`);
            } catch (error) {
                console.log(`✗ Error Code: ${error.code}`);
                console.log(`✗ Error Message: ${error.message}`);
            }
        }

        console.log('\n✓ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
