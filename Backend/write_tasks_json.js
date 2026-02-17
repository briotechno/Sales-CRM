const { pool } = require('./src/config/db');
const fs = require('fs');
async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE tasks");
        fs.writeFileSync('tasks_json.txt', JSON.stringify(rows, null, 2));
    } catch (e) {
        console.log("Error:", e.message);
    }
    process.exit();
}
checkSchema();
