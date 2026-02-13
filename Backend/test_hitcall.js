const { pool } = require('./src/config/db');
const Lead = require('./src/models/leadModel');

async function testHitCall() {
    try {
        console.log('Testing hitCall...');
        // Find a lead to test with
        const [leads] = await pool.query('SELECT id, user_id, name FROM leads LIMIT 1');
        if (!leads.length) {
            console.log('No leads found to test with');
            process.exit(1);
        }
        const lead = leads[0];
        console.log('Testing with lead:', lead.name, 'ID:', lead.id, 'User:', lead.user_id);

        const nextCall = "2026-02-14T10:00";
        const result = await Lead.hitCall(lead.id, 'connected', nextCall, '', lead.user_id, true);
        console.log('hitCall result:', result);

        // Check if task was created
        const [tasks] = await pool.query('SELECT * FROM tasks WHERE title LIKE ?', [`%Follow-up call: ${lead.name}%`]);
        console.log('Created tasks count:', tasks.length);
        if (tasks.length > 0) {
            console.log('Latest created task:', tasks[tasks.length - 1]);
        }

        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
}

testHitCall();
