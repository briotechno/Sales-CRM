const { pool } = require('../config/db');
const Messenger = require('../models/messengerModel');
require('dotenv').config({ path: './Backend/.env' });

async function testConversationCreation() {
    try {
        console.log('Testing conversation creation...\n');

        // Get two employees
        const [employees] = await pool.query('SELECT id, employee_name FROM employees LIMIT 2');

        if (employees.length < 2) {
            console.log('❌ Need at least 2 employees to test');
            process.exit(1);
        }

        const emp1 = employees[0];
        const emp2 = employees[1];

        console.log(`Creating conversation between:`);
        console.log(`  - ${emp1.employee_name} (ID: ${emp1.id})`);
        console.log(`  - ${emp2.employee_name} (ID: ${emp2.id})\n`);

        // Test 1: Create conversation
        const conv1 = await Messenger.getOrCreateConversation(emp1.id, 'employee', emp2.id, 'employee');
        console.log(`✅ Conversation created: ID ${conv1.id}`);

        // Test 2: Try to create same conversation (should return existing)
        const conv2 = await Messenger.getOrCreateConversation(emp1.id, 'employee', emp2.id, 'employee');
        console.log(`✅ Retrieved existing conversation: ID ${conv2.id}`);

        // Test 3: Try reverse order (should return same conversation)
        const conv3 = await Messenger.getOrCreateConversation(emp2.id, 'employee', emp1.id, 'employee');
        console.log(`✅ Reverse order returns same conversation: ID ${conv3.id}`);

        if (conv1.id === conv2.id && conv2.id === conv3.id) {
            console.log('\n🎉 All tests passed! Conversation creation works correctly.');
        } else {
            console.log('\n❌ Error: Different conversation IDs returned');
        }

        // Show the conversation details
        const [convDetails] = await pool.query('SELECT * FROM messenger_conversations WHERE id = ?', [conv1.id]);
        console.log('\n📋 Conversation Details:');
        console.log(convDetails[0]);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testConversationCreation();
