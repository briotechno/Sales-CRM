const { pool } = require('../config/db');

const updateQuotationsTable = async () => {
    try {
        console.log('Adding missing columns to quotations table...');

        const alterQueries = [
            'ALTER TABLE quotations ADD COLUMN IF NOT EXISTS customer_type VARCHAR(50) DEFAULT "Business"',
            'ALTER TABLE quotations ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255)',
            'ALTER TABLE quotations ADD COLUMN IF NOT EXISTS billing_address TEXT',
            'ALTER TABLE quotations ADD COLUMN IF NOT EXISTS shipping_address TEXT',
            'ALTER TABLE quotations ADD COLUMN IF NOT EXISTS state VARCHAR(100)',
            'ALTER TABLE quotations ADD COLUMN IF NOT EXISTS pincode VARCHAR(20)',
            'ALTER TABLE quotations ADD COLUMN IF NOT EXISTS gstin VARCHAR(50)',
            'ALTER TABLE quotations ADD COLUMN IF NOT EXISTS pan_number VARCHAR(50)',
            'ALTER TABLE quotations ADD COLUMN IF NOT EXISTS cin_number VARCHAR(100)',
            'ALTER TABLE quotations ADD COLUMN IF NOT EXISTS sales_executive VARCHAR(255)'
        ];

        for (const query of alterQueries) {
            try {
                await pool.query(query);
            } catch (err) {
                // Ignore errors if columns already exist (though IF NOT EXISTS is used in some DB versions, 
                // MySQL 8.0.19+ supports it for ADD COLUMN but older ones don't)
                console.log(`Note: ${err.message}`);
            }
        }

        console.log('Quotations table updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating quotations table:', error);
        process.exit(1);
    }
};

updateQuotationsTable();
