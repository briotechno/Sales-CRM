const { pool } = require('./src/config/db');
async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE lead_calls");
        const statusRow = rows.find(r => r.Field === 'status');
        console.log("lead_calls.status type:", statusRow.Type);
    } catch (e) {
        console.log("Error:", e.message);
    }
    process.exit();
}
checkSchema();
