const { pool } = require('./src/config/db');

async function describeSalaries() {
    try {
        const [rows] = await pool.query('DESCRIBE salaries');
        console.log('--- Salaries Table Structure ---');
        console.table(rows);
        process.exit(0);
    } catch (error) {
        console.error('Error describing table:', error);
        process.exit(1);
    }
}

describeSalaries();
