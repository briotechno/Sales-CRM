const { pool } = require('./src/config/db');
const fs = require('fs');

async function checkTasks() {
    try {
        const [rows] = await pool.query('SELECT * FROM tasks ORDER BY id DESC LIMIT 5');
        let output = 'Latest 5 tasks:\n';
        rows.forEach(row => {
            output += JSON.stringify(row, null, 2) + '\n---\n';
        });
        fs.writeFileSync('latest_tasks_debug.txt', output);
        console.log('Task info written to latest_tasks_debug.txt');
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('latest_tasks_debug.txt', 'Error: ' + err.message);
        console.error('Error fetching tasks:', err.message);
        process.exit(1);
    }
}

checkTasks();
