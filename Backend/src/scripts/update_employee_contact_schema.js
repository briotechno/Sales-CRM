const { pool } = require('../config/db');

const updateEmployeeContactSchema = async () => {
    try {
        console.log('Updating employees table schema for enhanced contact information...');

        const columns = [
            { name: 'work_email', type: 'VARCHAR(255)' },
            { name: 'work_mobile_number', type: 'VARCHAR(20)' },
            { name: 'linkedin_url', type: 'VARCHAR(255)' },
            { name: 'skype_id', type: 'VARCHAR(100)' },
            { name: 'permanent_address_l1', type: 'TEXT' },
            { name: 'permanent_address_l2', type: 'TEXT' },
            { name: 'permanent_address_l3', type: 'TEXT' },
            { name: 'permanent_city', type: 'VARCHAR(100)' },
            { name: 'permanent_state', type: 'VARCHAR(100)' },
            { name: 'permanent_country', type: 'VARCHAR(100)' },
            { name: 'permanent_pincode', type: 'VARCHAR(20)' },
            { name: 'correspondence_city', type: 'VARCHAR(100)' }
        ];

        for (const col of columns) {
            try {
                // Check if column exists
                const [cols] = await pool.query(`SHOW COLUMNS FROM employees LIKE ?`, [col.name]);
                if (cols.length === 0) {
                    console.log(`Adding column ${col.name}...`);
                    await pool.query(`ALTER TABLE employees ADD COLUMN ${col.name} ${col.type}`);
                    console.log(`Column ${col.name} added successfully.`);
                } else {
                    console.log(`Column ${col.name} already exists.`);
                }
            } catch (err) {
                console.error(`Error processing column ${col.name}:`, err.message);
            }
        }

        console.log('Employees table schema updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating employees table:', error);
        process.exit(1);
    }
};

updateEmployeeContactSchema();
