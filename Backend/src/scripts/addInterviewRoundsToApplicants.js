const { pool } = require('../config/db');

async function migrate() {
    try {
        console.log('Adding interview_rounds to applicants table...');

        // 1. Add the column
        await pool.execute(`
            ALTER TABLE applicants 
            ADD COLUMN IF NOT EXISTS interview_rounds JSON AFTER application_data
        `);

        // 2. Populate existing applicants with their job's rounds
        console.log('Populating existing applicants with job rounds...');
        await pool.execute(`
            UPDATE applicants a
            JOIN jobs j ON a.job_id = j.id
            SET a.interview_rounds = j.interview_rounds
            WHERE a.interview_rounds IS NULL
        `);

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
