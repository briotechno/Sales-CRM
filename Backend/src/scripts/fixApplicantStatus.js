const { pool } = require('../config/db');

async function fixApplicantStatus() {
    try {
        console.log('Fixing applicant status column...');

        // Change status to VARCHAR to support dynamic interview rounds
        await pool.execute(`
            ALTER TABLE applicants 
            MODIFY COLUMN status VARCHAR(50) DEFAULT 'Applied'
        `);

        console.log('Applicant status column updated to VARCHAR(50).');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing applicant status:', error);
        process.exit(1);
    }
}

fixApplicantStatus();
