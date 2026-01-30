const { pool } = require('./src/config/db');
async function run() {
    try {
        const [cols] = await pool.query("SHOW COLUMNS FROM employees LIKE 'education'");
        if (cols.length === 0) {
            await pool.query("ALTER TABLE employees ADD COLUMN education JSON AFTER languages");
            console.log('COLUMN_ADDED');
        } else {
            console.log('COLUMN_EXISTS');
        }
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        process.exit();
    }
}
run();
