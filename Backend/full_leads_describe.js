const { pool } = require('./src/config/db');
async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE leads");
        rows.forEach(r => console.log(`${r.Field}: ${r.Type}`));
    } catch (e) {
        console.log("Error:", e.message);
    }
    process.exit();
}
checkSchema();
