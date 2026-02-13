const { pool } = require('./src/config/db');

async function checkSchema() {
    try {
        const [columns] = await pool.query('DESCRIBE lead_assignment_logs');
        console.log('Columns in lead_assignment_logs:');
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
