const { pool } = require('./src/config/db');
const fs = require('fs');
async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE leads");
        let output = "";
        for (const r of rows) {
            output += `${r.Field}: ${r.Type}\n`;
        }
        fs.writeFileSync('schema_clean.txt', output);
    } catch (e) {
        console.log("Error:", e.message);
    }
    process.exit();
}
checkSchema();
