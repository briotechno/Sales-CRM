const { pool } = require('./src/config/db');
const fs = require('fs');
async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE tasks");
        let output = "";
        for (const r of rows) {
            output += `${r.Field}: ${r.Type}\n`;
        }
        fs.writeFileSync('tasks_schema_clean.txt', output);
    } catch (e) {
        console.log("Error:", e.message);
    }
    process.exit();
}
checkSchema();
