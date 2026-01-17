const { pool } = require('../src/config/db');

const addLimitsToProductKeys = async () => {
    try {
        console.log('Adding leads and storage columns to product_keys table...');

        // Add leads column
        try {
            await pool.query(`ALTER TABLE product_keys ADD COLUMN leads INT DEFAULT 0`);
            console.log('Added leads column.');
        } catch (error) {
            console.log('leads column might already exist:', error.message);
        }

        // Add storage column
        try {
            await pool.query(`ALTER TABLE product_keys ADD COLUMN storage INT DEFAULT 0`);
            console.log('Added storage column.');
        } catch (error) {
            console.log('storage column might already exist:', error.message);
        }

        console.log('Product Keys table update completed.');
    } catch (error) {
        console.error('Error updating table:', error);
    } finally {
        process.exit();
    }
};

addLimitsToProductKeys();
