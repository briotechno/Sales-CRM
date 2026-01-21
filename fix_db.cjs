const { pool } = require('./Backend/src/config/db');

async function fixDatabase() {
    try {
        console.log('Attempting to add description column to pipeline_stages...');
        await pool.query('ALTER TABLE pipeline_stages ADD COLUMN IF NOT EXISTS description TEXT AFTER name');
        console.log('Successfully added description column (or it already existed).');
        process.exit(0);
    } catch (error) {
        console.error('Error adding description column:', error);
        // If "IF NOT EXISTS" is not supported by the MariaDB/MySQL version, it might fail if already exists.
        // But usually it's fine.
        process.exit(1);
    }
}

fixDatabase();
