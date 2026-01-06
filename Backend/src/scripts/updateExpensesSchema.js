const { pool } = require('../config/db');

const updateExpensesSchema = async () => {
    try {
        // Check if column exists
        const [columns] = await pool.query("SHOW COLUMNS FROM expenses LIKE 'receipt_url'");

        if (columns.length === 0) {
            await pool.query("ALTER TABLE expenses ADD COLUMN receipt_url VARCHAR(255) AFTER date");
            console.log('Added receipt_url column to expenses table.');
        } else {
            console.log('receipt_url column already exists.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error updating expenses table:', error);
        process.exit(1);
    }
};

updateExpensesSchema();
