const { pool } = require('./src/config/db');
async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE tasks");
        console.log(JSON.stringify(rows, null, 2));
    } catch (e) {
        console.log("Error:", e.message);
    }
    process.exit();
}
checkSchema();
