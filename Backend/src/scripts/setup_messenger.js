const { pool } = require('../config/db');

async function setupMessengerTables() {
    try {
        console.log('Creating messenger tables...');

        // 1. Conversations Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messenger_conversations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                participant_one_id INT NOT NULL,
                participant_one_type ENUM('user', 'client', 'employee') NOT NULL,
                participant_two_id INT NOT NULL,
                participant_two_type ENUM('user', 'client', 'employee') NOT NULL,
                last_message_text TEXT,
                last_message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_participants (participant_one_id, participant_one_type, participant_two_id, participant_two_type)
            )
        `);

        // 2. Messages Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messenger_messages (
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
                FOREIGN KEY (conversation_id) REFERENCES messenger_conversations(id) ON DELETE CASCADE
            )
        `);

        // 3. Reactions Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messenger_message_reactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                message_id INT NOT NULL,
                user_id INT NOT NULL,
                user_type ENUM('user', 'client', 'employee') NOT NULL,
                emoji VARCHAR(10) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_reaction (message_id, user_id, user_type, emoji),
                FOREIGN KEY (message_id) REFERENCES messenger_messages(id) ON DELETE CASCADE
            )
        `);

        // 4. Pin messages
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messenger_pinned_messages (
                conversation_id INT NOT NULL,
                message_id INT NOT NULL,
                pinned_by_id INT NOT NULL,
                pinned_by_type ENUM('user', 'client', 'employee') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (conversation_id, message_id),
                FOREIGN KEY (conversation_id) REFERENCES messenger_conversations(id) ON DELETE CASCADE,
                FOREIGN KEY (message_id) REFERENCES messenger_messages(id) ON DELETE CASCADE
            )
        `);

        console.log('Messenger tables created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating messenger tables:', error);
        process.exit(1);
    }
}

setupMessengerTables();
