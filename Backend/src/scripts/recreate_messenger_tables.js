const { pool } = require('../config/db');
require('dotenv').config({ path: './Backend/.env' });

async function recreateMessengerTables() {
    try {
        console.log('Dropping existing messenger tables...');

        // Drop tables in reverse order (due to foreign keys)
        await pool.query('DROP TABLE IF EXISTS messenger_pinned_messages');
        await pool.query('DROP TABLE IF EXISTS messenger_message_reactions');
        await pool.query('DROP TABLE IF EXISTS messenger_messages');
        await pool.query('DROP TABLE IF EXISTS messenger_conversations');

        console.log('Creating new messenger tables with correct schema...');

        // 1. Conversations Table
        await pool.query(`
            CREATE TABLE messenger_conversations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                participant_one_id INT NOT NULL,
                participant_one_type ENUM('user', 'client', 'employee') NOT NULL,
                participant_two_id INT NOT NULL,
                participant_two_type ENUM('user', 'client', 'employee') NOT NULL,
                last_message_text TEXT,
                last_message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_participants (participant_one_id, participant_one_type, participant_two_id, participant_two_type)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // 2. Messages Table
        await pool.query(`
            CREATE TABLE messenger_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                conversation_id INT NOT NULL,
                sender_id INT NOT NULL,
                sender_type ENUM('user', 'client', 'employee') NOT NULL,
                text TEXT,
                message_type ENUM('text', 'image', 'file', 'voice') DEFAULT 'text',
                file_url VARCHAR(255),
                file_name VARCHAR(255),
                file_size VARCHAR(50),
                duration INT,
                reply_to_id INT,
                is_read BOOLEAN DEFAULT FALSE,
                is_edited BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (conversation_id) REFERENCES messenger_conversations(id) ON DELETE CASCADE,
                INDEX idx_conversation (conversation_id),
                INDEX idx_sender (sender_id, sender_type)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // 3. Reactions Table
        await pool.query(`
            CREATE TABLE messenger_message_reactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                message_id INT NOT NULL,
                user_id INT NOT NULL,
                user_type ENUM('user', 'client', 'employee') NOT NULL,
                emoji VARCHAR(10) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_reaction (message_id, user_id, user_type, emoji),
                FOREIGN KEY (message_id) REFERENCES messenger_messages(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // 4. Pin messages
        await pool.query(`
            CREATE TABLE messenger_pinned_messages (
                conversation_id INT NOT NULL,
                message_id INT NOT NULL,
                pinned_by_id INT NOT NULL,
                pinned_by_type ENUM('user', 'client', 'employee') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (conversation_id, message_id),
                FOREIGN KEY (conversation_id) REFERENCES messenger_conversations(id) ON DELETE CASCADE,
                FOREIGN KEY (message_id) REFERENCES messenger_messages(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('✅ Messenger tables recreated successfully with correct schema!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error recreating messenger tables:', error);
        process.exit(1);
    }
}

recreateMessengerTables();
