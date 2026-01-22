const { pool } = require('../config/db');

async function setupMessenger() {
    try {
        console.log('Setting up messenger tables...');

        // 1. Messenger Conversations
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messenger_conversations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                participant_one_id INT NOT NULL,
                participant_one_type ENUM('user', 'employee', 'client') NOT NULL,
                participant_two_id INT NOT NULL,
                participant_two_type ENUM('user', 'employee', 'client') NOT NULL,
                last_message_text TEXT,
                last_message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_participants (participant_one_id, participant_one_type, participant_two_id, participant_two_type)
            )
        `);

        // 2. Messenger Messages
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messenger_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                conversation_id INT NOT NULL,
                sender_id INT NOT NULL,
                sender_type ENUM('user', 'employee', 'client') NOT NULL,
                text TEXT,
                message_type ENUM('text', 'image', 'file', 'voice', 'video', 'location') DEFAULT 'text',
                file_url VARCHAR(255),
                file_name VARCHAR(255),
                file_size VARCHAR(50),
                duration INT,
                reply_to_id INT,
                is_read BOOLEAN DEFAULT FALSE,
                is_delivered BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (conversation_id) REFERENCES messenger_conversations(id) ON DELETE CASCADE
            )
        `);

        // 3. Messenger Reactions
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messenger_message_reactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                message_id INT NOT NULL,
                user_id INT NOT NULL,
                user_type ENUM('user', 'employee', 'client') NOT NULL,
                emoji VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_user_reaction (message_id, user_id, user_type, emoji),
                FOREIGN KEY (message_id) REFERENCES messenger_messages(id) ON DELETE CASCADE
            )
        `);

        console.log('Messenger tables setup successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up messenger tables:', error);
        process.exit(1);
    }
}

setupMessenger();
