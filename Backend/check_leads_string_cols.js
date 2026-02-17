const { pool } = require('./src/config/db');
async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE leads");
        for (const r of rows) {
            if (r.Type.includes('char') || r.Type.includes('text') || r.Type.includes('enum')) {
                console.log(`${r.Field}: ${r.Type}`);
            }
        }
    } catch (e) {
        console.log("Error:", e.message);
    }
    process.exit();
}
checkSchema();
