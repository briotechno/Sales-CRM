const { pool } = require('../config/db');

const updateHrPoliciesTable = async () => {
    try {
        console.log('Updating hr_policies table...');

        // Change document_path column type to TEXT to support multiple file paths (JSON)
        await pool.query(`
            ALTER TABLE hr_policies 
            MODIFY COLUMN document_path TEXT
        `);

        console.log('hr_policies table updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating hr_policies table:', error);
        process.exit(1);
    }
};

updateHrPoliciesTable();
