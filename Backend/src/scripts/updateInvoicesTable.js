const { pool } = require('../config/db');

const updateInvoicesTable = async () => {
    const columnsToAdd = [
        { name: 'quotation_id', type: 'INT', after: 'invoice_number' },
        { name: 'tax_type', type: "VARCHAR(50) DEFAULT 'GST'", after: 'notes' },
        { name: 'client_gstin', type: 'VARCHAR(50)', after: 'tax_type' },
        { name: 'business_gstin', type: 'VARCHAR(50)', after: 'client_gstin' },
        { name: 'pan_number', type: 'VARCHAR(50)', after: 'business_gstin' },
        { name: 'terms_and_conditions', type: 'TEXT', after: 'pan_number' },
        { name: 'customer_type', type: "VARCHAR(50) DEFAULT 'Business'", after: 'terms_and_conditions' },
        { name: 'pincode', type: 'VARCHAR(20)', after: 'customer_type' },
        { name: 'contact_person', type: 'VARCHAR(255)', after: 'pincode' },
        { name: 'state', type: 'VARCHAR(255)', after: 'contact_person' },
        { name: 'discount', type: 'DECIMAL(15, 2) DEFAULT 0', after: 'tax_amount' }
    ];

    try {
        // Check existing columns
        const [existingColumns] = await pool.query('SHOW COLUMNS FROM invoices');
        const existingColumnNames = existingColumns.map(c => c.Field);

        for (const col of columnsToAdd) {
            if (!existingColumnNames.includes(col.name)) {
                console.log(`Adding column: ${col.name}`);
                await pool.query(`ALTER TABLE invoices ADD COLUMN ${col.name} ${col.type} AFTER ${col.after}`);
            } else {
                console.log(`Column ${col.name} already exists`);
            }
        }

        console.log('Invoices table updated successfully');
    } catch (error) {
        console.error('Error updating invoices table:', error);
    } finally {
        process.exit();
    }
};

updateInvoicesTable();
