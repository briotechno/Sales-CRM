const { pool } = require('./src/config/db');

async function fixMessengerSchema() {
    try {
        console.log('Checking and fixing messenger_conversations schema...');
        
        // Add team_id column
        await pool.query('ALTER TABLE messenger_conversations ADD COLUMN team_id INT DEFAULT NULL AFTER id');
        
        // Add index for team_id
        await pool.query('ALTER TABLE messenger_conversations ADD INDEX idx_team (team_id)');
        
        // Make participant columns nullable
        await pool.query('ALTER TABLE messenger_conversations MODIFY participant_one_id INT NULL');
        await pool.query('ALTER TABLE messenger_conversations MODIFY participant_one_type ENUM(\'user\', \'client\', \'employee\') NULL');
        await pool.query('ALTER TABLE messenger_conversations MODIFY participant_two_id INT NULL');
        await pool.query('ALTER TABLE messenger_conversations MODIFY participant_two_type ENUM(\'user\', \'client\', \'employee\') NULL');
        
        // Also update messenger_messages sender_type to include 'team' if needed (though messages are sent by users/employees)
        // No changes needed to messenger_messages for now as messages are still sent by people.
        
        console.log('✅ Base schema updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating messenger schema:', error);
        process.exit(1);
    }
}

fixMessengerSchema();
