const { pool } = require('./src/config/db');
require('dotenv').config();

async function migrate() {
    try {
        console.log('Starting migration: Update invoices table with Policy fields');

        const queries = [
            'ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_type VARCHAR(20) DEFAULT "GST"',
            'ALTER TABLE invoices ADD COLUMN IF NOT EXISTS discount DECIMAL(15,2) DEFAULT 0',
            'ALTER TABLE invoices ADD COLUMN IF NOT EXISTS client_gstin VARCHAR(50)',
            'ALTER TABLE invoices ADD COLUMN IF NOT EXISTS business_gstin VARCHAR(50)',
            'ALTER TABLE invoices ADD COLUMN IF NOT EXISTS pan_number VARCHAR(50)',
            'ALTER TABLE invoices ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT'
        ];

        for (const query of queries) {
            try {
                await pool.query(query);
            } catch (err) {
                // Ignore if column already exists
                if (!err.message.includes('Duplicate column name')) {
                    throw err;
                }
            }
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
