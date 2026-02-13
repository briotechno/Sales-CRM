const { pool } = require('./src/config/db');

async function runSettingsMigration() {
    console.log('Starting migration for lead_assignment_settings...');

    const queries = [
        `ALTER TABLE lead_assignment_settings ADD COLUMN IF NOT EXISTS max_call_attempts INT DEFAULT 5`,
        `ALTER TABLE lead_assignment_settings ADD COLUMN IF NOT EXISTS call_time_gap_minutes INT DEFAULT 60`,
        `ALTER TABLE lead_assignment_settings ADD COLUMN IF NOT EXISTS auto_disqualification TINYINT(1) DEFAULT 0`,
        `ALTER TABLE lead_assignment_settings ADD COLUMN IF NOT EXISTS reassignment_on_disqualified TINYINT(1) DEFAULT 0`
    ];

    for (const query of queries) {
        try {
            await pool.query(query);
            console.log(`✓ Executed: ${query.substring(0, 70)}...`);
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log(`- Column already exists, skipping...`);
            } else {
                console.error(`✗ Error: ${error.message}`);
            }
        }
    }

    console.log('\n✓ Migration for lead_assignment_settings completed!');
    process.exit(0);
}

runSettingsMigration().catch(err => {
    console.error('Migration crashed:', err);
    process.exit(1);
});
