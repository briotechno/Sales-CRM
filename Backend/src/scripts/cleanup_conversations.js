const { pool } = require('../config/db');
require('dotenv').config({ path: './Backend/.env' });

async function cleanupDuplicateConversations() {
    try {
        console.log('Cleaning up duplicate conversations...');

        // Find and delete duplicate conversations (keeping the oldest one)
        await pool.query(`
            DELETE c1 FROM messenger_conversations c1
            INNER JOIN messenger_conversations c2 
            WHERE c1.id > c2.id
            AND (
                (c1.participant_one_id = c2.participant_one_id AND c1.participant_one_type = c2.participant_one_type 
                 AND c1.participant_two_id = c2.participant_two_id AND c1.participant_two_type = c2.participant_two_type)
                OR
                (c1.participant_one_id = c2.participant_two_id AND c1.participant_one_type = c2.participant_two_type 
                 AND c1.participant_two_id = c2.participant_one_id AND c1.participant_two_type = c2.participant_one_type)
            )
        `);

        console.log('Cleanup complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error cleaning up:', error);
        process.exit(1);
    }
}

cleanupDuplicateConversations();
