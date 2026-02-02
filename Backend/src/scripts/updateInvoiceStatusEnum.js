const { pool } = require('../config/db');

const updateInvoiceStatusEnum = async () => {
    try {
        // First, check if there are any existing statuses that aren't in our new list
        // and map them if necessary. For now, we'll just alter the column.

        console.log('Updating invoice status enum...');

        // This query updates the ENUM values for the status column
        const query = `
            ALTER TABLE invoices 
            MODIFY COLUMN status ENUM('Draft', 'Sent', 'Partial', 'Paid', 'Unpaid', 'Cancelled') DEFAULT 'Unpaid'
        `;

        await pool.query(query);

        console.log('Invoice status enum updated successfully to: Draft, Sent, Partial, Paid, Unpaid, Cancelled');
    } catch (error) {
        console.error('Error updating invoice status enum:', error);
    } finally {
        process.exit();
    }
};

updateInvoiceStatusEnum();
