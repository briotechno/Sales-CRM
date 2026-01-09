const { pool } = require('../config/db');

const addClientIdToQuotations = async () => {
    try {
        // Check if column already exists
        const [columns] = await pool.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'quotations' 
            AND COLUMN_NAME = 'client_id'
        `);

        if (columns.length > 0) {
            console.log('client_id column already exists in quotations table');
            return;
        }

        // Add client_id column
        await pool.query(`
            ALTER TABLE quotations 
            ADD COLUMN client_id INT AFTER quotation_id,
            ADD FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
        `);

        console.log('Successfully added client_id column to quotations table');

        // Optional: Try to link existing quotations to clients based on email
        await pool.query(`
            UPDATE quotations q
            LEFT JOIN clients c ON q.email = c.email AND q.user_id = c.user_id
            SET q.client_id = c.id
            WHERE q.email IS NOT NULL AND c.id IS NOT NULL
        `);

        console.log('Successfully linked existing quotations to clients where possible');

    } catch (error) {
        console.error('Error adding client_id to quotations:', error);
    } finally {
        process.exit();
    }
};

addClientIdToQuotations();
