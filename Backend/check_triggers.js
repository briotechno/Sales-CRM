const { pool } = require('./src/config/db');
async function checkTriggers() {
    try {
        const [rows] = await pool.query("SHOW TRIGGERS");
        console.log("Triggers:", JSON.stringify(rows, null, 2));
    } catch (e) {
        console.log("Error:", e.message);
    }
    process.exit();
}
checkTriggers();
