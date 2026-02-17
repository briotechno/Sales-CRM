const { pool } = require('./src/config/db');
async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE lead_calls");
        const statusCol = rows.find(r => r.Field === 'status');
        console.log("lead_calls.status:", statusCol.Type);

        const [rows2] = await pool.query("DESCRIBE leads");
        const leadStatusCol = rows2.find(r => r.Field === 'status');
        console.log("leads.status:", leadStatusCol.Type);
    } catch (e) {
        console.log("Error:", e.message);
    }
    process.exit();
}
checkSchema();
