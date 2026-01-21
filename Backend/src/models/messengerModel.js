const { pool } = require('../config/db');

const Messenger = {
    // Find or create a conversation between two participants
    getOrCreateConversation: async (p1Id, p1Type, p2Id, p2Type) => {
        // Ensure IDs are consistent for unique key (smaller ID first if same type)
        let part1Id = p1Id, part1Type = p1Type, part2Id = p2Id, part2Type = p2Type;

        if (p1Type === p2Type && p1Id > p2Id) {
            part1Id = p2Id; part1Type = p2Type;
            part2Id = p1Id; part2Type = p1Type;
        } else if (p1Type > p2Type) {
            // Lexicographical order for types
            part1Id = p2Id; part1Type = p2Type;
            part2Id = p1Id; part2Type = p1Type;
        }

        // Try to find existing (check both directions)
        const [rows] = await pool.query(
            `SELECT * FROM messenger_conversations 
             WHERE (participant_one_id = ? AND participant_one_type = ? AND participant_two_id = ? AND participant_two_type = ?)
             OR (participant_one_id = ? AND participant_one_type = ? AND participant_two_id = ? AND participant_two_type = ?)`,
            [part1Id, part1Type, part2Id, part2Type, part2Id, part2Type, part1Id, part1Type]
        );

        if (rows.length > 0) return rows[0];

        // Create new
        const [result] = await pool.query(
            `INSERT INTO messenger_conversations 
             (participant_one_id, participant_one_type, participant_two_id, participant_two_type) 
             VALUES (?, ?, ?, ?)`,
            [part1Id, part1Type, part2Id, part2Type]
        );

        return {
            id: result.insertId,
            participant_one_id: part1Id,
            participant_one_type: part1Type,
            participant_two_id: part2Id,
            participant_two_type: part2Type
        };
    },

    // Save a new message
    saveMessage: async (msgData) => {
        const {
            conversation_id, sender_id, sender_type, text,
            message_type, file_url, file_name, file_size, duration, reply_to_id
        } = msgData;

        const [result] = await pool.query(
            `INSERT INTO messenger_messages 
             (conversation_id, sender_id, sender_type, text, message_type, file_url, file_name, file_size, duration, reply_to_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [conversation_id, sender_id, sender_type, text, message_type || 'text', file_url, file_name, file_size, duration, reply_to_id]
        );

        // Update conversation's last message
        await pool.query(
            `UPDATE messenger_conversations SET last_message_text = ?, last_message_time = CURRENT_TIMESTAMP WHERE id = ?`,
            [text || (message_type === 'image' ? '[Image]' : '[Attachment]'), conversation_id]
        );

        return result.insertId;
    },

    // Get messages for a conversation
    getMessages: async (conversationId, limit = 50, offset = 0) => {
        const [rows] = await pool.query(
            `SELECT * FROM messenger_messages
             WHERE conversation_id = ? 
             ORDER BY created_at ASC 
             LIMIT ? OFFSET ?`,
            [conversationId, limit, offset]
        );

        // Fetch reactions separately for each message
        for (let msg of rows) {
            const [reactions] = await pool.query(
                `SELECT emoji, COUNT(*) as count 
                 FROM messenger_message_reactions 
                 WHERE message_id = ? 
                 GROUP BY emoji`,
                [msg.id]
            );
            msg.reactions = reactions.reduce((acc, r) => {
                acc[r.emoji] = r.count;
                return acc;
            }, {});
        }

        return rows;
    },

    // Get recent conversations for a user
    getConversations: async (userId, userType) => {
        const [rows] = await pool.query(
            `SELECT c.*, 
             CASE 
                WHEN participant_one_id = ? AND participant_one_type = ? THEN participant_two_id 
                ELSE participant_one_id 
             END as other_id,
             CASE 
                WHEN participant_one_id = ? AND participant_one_type = ? THEN participant_two_type 
                ELSE participant_one_type 
             END as other_type,
             (SELECT COUNT(*) FROM messenger_messages WHERE conversation_id = c.id AND sender_id != ? AND is_read = FALSE) as unread_count
             FROM messenger_conversations c
             WHERE (participant_one_id = ? AND participant_one_type = ?) 
             OR (participant_two_id = ? AND participant_two_type = ?)
             ORDER BY last_message_time DESC`,
            [userId, userType, userId, userType, userId, userId, userType, userId, userType]
        );
        return rows;
    },

    // Mark messages as read
    markAsRead: async (conversationId, userId, userType) => {
        await pool.query(
            `UPDATE messenger_messages SET is_read = TRUE 
             WHERE conversation_id = ? AND sender_id != ? AND is_read = FALSE`,
            [conversationId, userId]
        );
    },

    // Handle reactions
    addReaction: async (messageId, userId, userType, emoji) => {
        await pool.query(
            `INSERT INTO messenger_message_reactions (message_id, user_id, user_type, emoji) 
             VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE emoji = VALUES(emoji)`,
            [messageId, userId, userType, emoji]
        );
    },

    deleteReaction: async (messageId, userId, userType, emoji) => {
        await pool.query(
            `DELETE FROM messenger_message_reactions WHERE message_id = ? AND user_id = ? AND user_type = ? AND emoji = ?`,
            [messageId, userId, userType, emoji]
        );
    }
};

module.exports = Messenger;
