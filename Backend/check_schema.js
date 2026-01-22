const { pool } = require('./src/config/db');

async function checkSchema() {
    try {
        const tables = ['departments', 'designations', 'employees'];
        for (const table of tables) {
            const [cols] = await pool.query(`SHOW COLUMNS FROM ${table}`);
            console.log(`--- ${table} ---`);
            cols.forEach(c => console.log(c.Field));
        }
        process.exit(0);
    } catch (error) {
        console.error('Error checking schema:', error);
        process.exit(1);
    }
}

checkSchema();
