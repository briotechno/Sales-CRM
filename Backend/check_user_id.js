const { pool } = require('./src/config/db');
const fs = require('fs');

async function checkUser() {
    try {
        const [rows] = await pool.query('SELECT user_id FROM leads WHERE name = "testtttt"');
        let output = 'User ID for testtttt: ' + (rows[0]?.user_id || 'not found');
        fs.writeFileSync('user_id_debug.txt', output);
        console.log('User ID written to user_id_debug.txt');
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('user_id_debug.txt', 'Error: ' + err.message);
        process.exit(1);
    }
}

checkUser();
