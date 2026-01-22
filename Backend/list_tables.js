const { pool } = require('./src/config/db');

async function listTables() {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        console.log('--- Current Tables in Database ---');
        rows.forEach(row => {
            console.log(Object.values(row)[0]);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error listing tables:', error);
        process.exit(1);
    }
}

listTables();
