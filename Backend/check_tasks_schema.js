const { pool } = require('./src/config/db');
const fs = require('fs');

async function checkSchema() {
    try {
        const [rows] = await pool.query('DESCRIBE tasks');
        let output = 'Columns in tasks:\n';
        rows.forEach(row => {
            output += `- ${row.Field} (${row.Type})\n`;
        });
        fs.writeFileSync('tasks_schema_info.txt', output);
        console.log('Schema info written to tasks_schema_info.txt');
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('tasks_schema_info.txt', 'Error: ' + err.message);
        console.error('Error fetching schema:', err.message);
        process.exit(1);
    }
}

checkSchema();
