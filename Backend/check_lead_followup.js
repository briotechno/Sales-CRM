const { pool } = require('./src/config/db');
const fs = require('fs');

async function checkLead() {
    try {
        const [rows] = await pool.query('SELECT name, next_call_at, tag FROM leads WHERE name LIKE "%test%" ORDER BY updated_at DESC LIMIT 5');
        let output = 'Latest test leads:\n';
        rows.forEach(row => {
            output += JSON.stringify(row, null, 2) + '\n---\n';
        });
        fs.writeFileSync('lead_debug.txt', output);
        console.log('Lead info written to lead_debug.txt');
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('lead_debug.txt', 'Error: ' + err.message);
        console.error('Error fetching lead:', err.message);
        process.exit(1);
    }
}

checkLead();
