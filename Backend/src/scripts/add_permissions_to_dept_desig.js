const path = require('path');
const { pool } = require(path.join(__dirname, '../config/db'));


async function migrate() {
    try {
        console.log('Adding permissions column to departments and designations...');

        await pool.query('ALTER TABLE departments ADD COLUMN permissions JSON DEFAULT NULL AFTER description');
        console.log('Added permissions to departments');

        await pool.query('ALTER TABLE designations ADD COLUMN permissions JSON DEFAULT NULL AFTER description');
        console.log('Added permissions to designations');

        process.exit(0);
    } catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    }
}

migrate();
