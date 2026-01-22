const { pool } = require('../config/db');
require('dotenv').config({ path: './Backend/.env' });

async function testMessenger() {
    try {
        console.log('Testing Messenger Setup...\n');

        // 1. Check tables exist
        const [tables] = await pool.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME LIKE 'messenger_%'
        `);
        console.log('✓ Messenger tables:', tables.map(t => t.TABLE_NAME).join(', '));

        // 2. Check for employees
        const [employees] = await pool.query('SELECT COUNT(*) as count FROM employees');
        console.log(`✓ Total employees: ${employees[0].count}`);

        // 3. Check for clients
        const [clients] = await pool.query('SELECT COUNT(*) as count FROM clients');
        console.log(`✓ Total clients: ${clients[0].count}`);

        // 4. Check conversations
        const [conversations] = await pool.query('SELECT COUNT(*) as count FROM messenger_conversations');
        console.log(`✓ Total conversations: ${conversations[0].count}`);

        // 5. Check messages
        const [messages] = await pool.query('SELECT COUNT(*) as count FROM messenger_messages');
        console.log(`✓ Total messages: ${messages[0].count}`);

        // 6. Show sample data
        const [sampleEmployees] = await pool.query('SELECT id, employee_name, email FROM employees LIMIT 3');
        console.log('\n📋 Sample Employees:');
        sampleEmployees.forEach(e => console.log(`   - ${e.employee_name} (ID: ${e.id})`));

        const [sampleClients] = await pool.query('SELECT id, first_name, last_name, company_name FROM clients LIMIT 3');
        console.log('\n📋 Sample Clients:');
        sampleClients.forEach(c => console.log(`   - ${c.company_name || `${c.first_name} ${c.last_name}`} (ID: ${c.id})`));

        console.log('\n✅ Messenger is ready to use!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testMessenger();
