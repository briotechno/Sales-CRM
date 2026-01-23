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
             (conversation_id, sender_id, sender_type, text, message_type, file_url, file_name, file_size, duration, reply_to_id, is_delivered, is_forwarded) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [conversation_id, sender_id, sender_type, text, message_type || 'text', file_url, file_name, file_size, duration, reply_to_id, msgData.is_delivered || false, msgData.is_forwarded || false]
        );

        // Update conversation's last message
        await pool.query(
            `UPDATE messenger_conversations SET last_message_text = ?, last_message_time = CURRENT_TIMESTAMP WHERE id = ?`,
            [text || (message_type === 'image' ? '[Image]' : '[Attachment]'), conversation_id]
        );

        return result.insertId;
    },

    // Get messages for a conversation
    getMessages: async (conversationId, userId, userType, limit = 50, offset = 0) => {
        const [rows] = await pool.query(
            `SELECT m.*, 
             COALESCE(e.employee_name, CONCAT(u.firstName, ' ', u.lastName)) as sender_name,
             DATE_FORMAT(m.created_at, '%h:%i %p') as time,
             (SELECT COUNT(*) FROM messenger_starred_messages WHERE message_id = m.id AND user_id = ? AND user_type = ?) > 0 as is_starred,
             (SELECT COUNT(*) FROM messenger_pinned_messages WHERE message_id = m.id) > 0 as is_pinned
             FROM messenger_messages m
             LEFT JOIN employees e ON m.sender_id = e.id AND m.sender_type = 'employee'
             LEFT JOIN users u ON m.sender_id = u.id AND m.sender_type = 'user'
             WHERE m.conversation_id = ? 
             ORDER BY m.created_at ASC 
             LIMIT ? OFFSET ?`,
            [userId, userType, conversationId, limit, offset]
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

            // If it's a reply, fetch the replied message text
            if (msg.reply_to_id) {
                const [repliedMsg] = await pool.query(
                    `SELECT m.text, COALESCE(e.employee_name, CONCAT(u.firstName, ' ', u.lastName)) as sender_name
                     FROM messenger_messages m
                     LEFT JOIN employees e ON m.sender_id = e.id AND m.sender_type = 'employee'
                     LEFT JOIN users u ON m.sender_id = u.id AND m.sender_type = 'user'
                     WHERE m.id = ?`,
                    [msg.reply_to_id]
                );
                if (repliedMsg[0]) {
                    msg.replyTo = {
                        text: repliedMsg[0].text,
                        sender: repliedMsg[0].sender_name
                    };
                }
            }
        }

        return rows;
    },

    // Update message text
    updateMessage: async (messageId, text) => {
        await pool.query(
            `UPDATE messenger_messages SET text = ?, is_edited = TRUE WHERE id = ?`,
            [text, messageId]
        );
    },

    // Delete message
    deleteMessage: async (messageId) => {
        await pool.query(`DELETE FROM messenger_messages WHERE id = ?`, [messageId]);
    },

    // Toggle star status
    toggleStar: async (messageId, userId, userType) => {
        const [existing] = await pool.query(
            `SELECT * FROM messenger_starred_messages WHERE message_id = ? AND user_id = ? AND user_type = ?`,
            [messageId, userId, userType]
        );

        if (existing.length > 0) {
            await pool.query(
                `DELETE FROM messenger_starred_messages WHERE message_id = ? AND user_id = ? AND user_type = ?`,
                [messageId, userId, userType]
            );
            return false; // Not starred anymore
        } else {
            await pool.query(
                `INSERT INTO messenger_starred_messages (message_id, user_id, user_type) VALUES (?, ?, ?)`,
                [messageId, userId, userType]
            );
            return true; // Starred
        }
    },

    // Pin/Unpin message
    togglePin: async (messageId, conversationId, userId, userType) => {
        const [existing] = await pool.query(
            `SELECT * FROM messenger_pinned_messages WHERE message_id = ? AND conversation_id = ?`,
            [messageId, conversationId]
        );

        if (existing.length > 0) {
            await pool.query(
                `DELETE FROM messenger_pinned_messages WHERE message_id = ? AND conversation_id = ?`,
                [messageId, conversationId]
            );
            return false; // Unpinned
        } else {
            // Usually we only allow one pinned message per conversation, OR multiple. 
            // In the UI it seems like a banner, so maybe just one?
            // Let's allow multiple for now as table structure allows it, but clear others if we want "only one"
            // await pool.query(`DELETE FROM messenger_pinned_messages WHERE conversation_id = ?`, [conversationId]);

            await pool.query(
                `INSERT INTO messenger_pinned_messages (message_id, conversation_id, pinned_by_id, pinned_by_type) VALUES (?, ?, ?, ?)`,
                [messageId, conversationId, userId, userType]
            );
            return true; // Pinned
        }
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
             (SELECT COUNT(*) FROM messenger_messages 
              WHERE conversation_id = c.id 
              AND (sender_id != ? OR sender_type != ?) 
              AND is_read = FALSE) as unread_count
             FROM messenger_conversations c
             WHERE (participant_one_id = ? AND participant_one_type = ?) 
             OR (participant_two_id = ? AND participant_two_type = ?)
             ORDER BY last_message_time DESC`,
            [userId, userType, userId, userType, userId, userType, userId, userType, userId, userType]
        );
        return rows;
    },

    // Get starred messages for a user
    getStarredMessages: async (userId, userType) => {
        const [rows] = await pool.query(
            `SELECT m.*, s.created_at as starred_at
             FROM messenger_starred_messages s
             JOIN messenger_messages m ON s.message_id = m.id
             WHERE s.user_id = ? AND s.user_type = ?
             ORDER BY s.created_at DESC`,
            [userId, userType]
        );
        return rows;
    },

    // Mark messages as read
    markAsRead: async (conversationId, userId, userType) => {
        await pool.query(
            `UPDATE messenger_messages SET is_read = TRUE, is_delivered = TRUE
             WHERE conversation_id = ? AND (sender_id != ? OR sender_type != ?) AND is_read = FALSE`,
            [conversationId, userId, userType]
        );
    },

    // Mark as delivered
    markAsDelivered: async (messageId) => {
        await pool.query(
            `UPDATE messenger_messages SET is_delivered = TRUE WHERE id = ? AND is_delivered = FALSE`,
            [messageId]
        );
    },

    markConversationAsDelivered: async (conversationId, userId, userType) => {
        await pool.query(
            `UPDATE messenger_messages SET is_delivered = TRUE 
             WHERE conversation_id = ? AND (sender_id != ? OR sender_type != ?) AND is_delivered = FALSE`,
            [conversationId, userId, userType]
        );
    },

    markAllAsDeliveredForUser: async (userId, userType) => {
        await pool.query(
            `UPDATE messenger_messages m
             JOIN messenger_conversations c ON m.conversation_id = c.id
             SET m.is_delivered = TRUE 
             WHERE (
                (c.participant_one_id = ? AND c.participant_one_type = ?) 
                OR (c.participant_two_id = ? AND c.participant_two_type = ?)
             )
             AND (m.sender_id != ? OR m.sender_type != ?) 
             AND m.is_delivered = FALSE`,
            [userId, userType, userId, userType, userId, userType]
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
