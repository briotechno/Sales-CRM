const { pool } = require('../config/db');

const fixQuotationsTable = async () => {
    try {
        console.log('Checking and adding missing columns to quotations table...');

        // Get existing columns
        const [columns] = await pool.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'quotations'
        `);

        const existingColumns = columns.map(col => col.COLUMN_NAME);
        console.log('Existing columns:', existingColumns);

        // Define all required columns with their definitions
        const requiredColumns = {
            'customer_type': 'VARCHAR(50) DEFAULT "Business"',
            'contact_person': 'VARCHAR(255)',
            'billing_address': 'TEXT',
            'shipping_address': 'TEXT',
            'state': 'VARCHAR(100)',
            'pincode': 'VARCHAR(20)',
            'gstin': 'VARCHAR(50)',
            'pan_number': 'VARCHAR(50)',
            'cin_number': 'VARCHAR(100)',
            'sales_executive': 'VARCHAR(255)'
        };

        // Add missing columns
        for (const [columnName, columnDef] of Object.entries(requiredColumns)) {
            if (!existingColumns.includes(columnName)) {
                console.log(`Adding column: ${columnName}`);
                try {
                    await pool.query(`ALTER TABLE quotations ADD COLUMN ${columnName} ${columnDef}`);
                    console.log(`✓ Added column: ${columnName}`);
                } catch (err) {
                    console.error(`✗ Error adding ${columnName}:`, err.message);
                }
            } else {
                console.log(`✓ Column already exists: ${columnName}`);
            }
        }

        console.log('\n✅ Quotations table structure updated successfully!');

        // Show final structure
        const [finalColumns] = await pool.query(`
            SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'quotations'
            ORDER BY ORDINAL_POSITION
        `);

        console.log('\nFinal table structure:');
        console.table(finalColumns);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating quotations table:', error);
        process.exit(1);
    }
};

fixQuotationsTable();
