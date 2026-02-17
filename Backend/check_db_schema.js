const { pool } = require('./src/config/db');
async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE lead_calls");
        console.log("lead_calls table:", JSON.stringify(rows, null, 2));
        const [rows2] = await pool.query("DESCRIBE leads");
        console.log("leads table state column:", JSON.stringify(rows2.filter(r => r.Field === 'status'), null, 2));
    } catch (e) {
        console.log("Error:", e.message);
    }
    process.exit();
}
checkSchema();
