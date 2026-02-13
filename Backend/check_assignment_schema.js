const { pool } = require('./src/config/db');

async function checkSchema() {
    try {
        const [columns] = await pool.query('DESCRIBE lead_assignment_settings');
        console.log('Columns in lead_assignment_settings:');
        columns.forEach(col => {
            console.log(`- ${col.Field} (${col.Type})`);
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkSchema();
