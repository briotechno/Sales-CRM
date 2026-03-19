const { pool } = require('./src/config/db');

async function fixMessengerSchemaV2() {
    try {
        console.log('Further updating messenger_conversations schema...');
        
        // Update ENUMs
        await pool.query('ALTER TABLE messenger_conversations MODIFY participant_one_type ENUM(\'user\', \'client\', \'employee\', \'team\') NULL');
        await pool.query('ALTER TABLE messenger_conversations MODIFY participant_two_type ENUM(\'user\', \'client\', \'employee\', \'team\') NULL');
        
        // Update messages sender_type ENUM too? 
        // No, sender_type should still be a human (person). 
        
        console.log('✅ ENUMs updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating ENUMs:', error);
        process.exit(1);
    }
}

fixMessengerSchemaV2();
