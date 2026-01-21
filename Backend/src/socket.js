const { Server } = require('socket.io');
const Messenger = require('./models/messengerModel');

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Adjust in production
            methods: ["GET", "POST"]
        }
    });

    // Map to track online users: { userId_type: socketId }
    const onlineUsers = new Map();

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('setup', async (userData) => {
            // userData should have { id: employeeId, type: 'employee' }
            const userKey = `${userData.id}_${userData.type}`;
            socket.join(userKey);
            onlineUsers.set(userKey, socket.id);

            // Mark all messages for this user as delivered
            await Messenger.markAllAsDeliveredForUser(userData.id, userData.type);

            console.log('User joined room:', userKey);
            socket.emit('connected');
        });

        socket.on('join_chat', (room) => {
            socket.join(room);
            console.log('User joined chat room:', room);
        });

        socket.on('typing', (room) => socket.in(room).emit('typing', room));
        socket.on('stop_typing', (room) => socket.in(room).emit('stop_typing', room));

        socket.on('new_message', async (newMessage) => {
            if (!newMessage) return;

            const chat = newMessage.conversationId || newMessage.conversation_id;
            const participants = newMessage.participants;

            if (!participants || !chat) {
                return console.error('Invalid message: missing participants or conversation ID', newMessage);
            }

            const senderId = newMessage.sender?.id || newMessage.sender_id;
            const senderType = newMessage.sender?.type || newMessage.sender_type;

            if (!senderId || !senderType) {
                return console.error('Invalid message: missing sender info', newMessage);
            }

            // Persist message if not already saved via REST
            if (!newMessage.id) {
                try {
                    const messageId = await Messenger.saveMessage({
                        conversation_id: chat,
                        sender_id: senderId,
                        sender_type: senderType,
                        text: newMessage.text,
                        message_type: newMessage.messageType || 'text',
                        reply_to_id: newMessage.replyToId
                    });
                    newMessage.id = messageId;
                } catch (saveError) {
                    return console.error('Error saving socket message:', saveError);
                }
            }

            // Broadcast to other participants
            participants.forEach(p => {
                if (Number(p.id) === Number(senderId) && p.type === senderType) return;

                const userKey = `${p.id}_${p.type}`;
                const isOnline = onlineUsers.has(userKey);

                if (isOnline) {
                    Messenger.markAsDelivered(newMessage.id);
                    newMessage.is_delivered = true;
                }

                socket.in(userKey).emit('message_received', newMessage);
                socket.in(chat).emit('message_received', newMessage);

                // Notify sender if delivered
                if (isOnline) {
                    const senderKey = `${senderId}_${senderType}`;
                    socket.in(senderKey).emit('message_delivered', {
                        messageId: newMessage.id,
                        conversationId: chat
                    });
                }
            });
        });

        socket.on('mark_as_read', async (data) => {
            const { conversationId, userId, userType, otherId, otherType } = data;
            await Messenger.markAsRead(conversationId, userId, userType);

            // Notify the sender that their messages were read
            const otherKey = `${otherId}_${otherType}`;
            socket.in(otherKey).emit('messages_read', {
                conversationId,
                readBy: userId,
                readByType: userType
            });

            // Also notify other devices of the reader (sync)
            const myKey = `${userId}_${userType}`;
            socket.in(myKey).emit('messages_read', {
                conversationId,
                readBy: userId,
                readByType: userType
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // Cleanup onlineUsers map (requires iterating or a reverse map)
            for (const [key, value] of onlineUsers.entries()) {
                if (value === socket.id) {
                    onlineUsers.delete(key);
                    break;
                }
            }
        });
    });

    return io;
};

module.exports = initializeSocket;
