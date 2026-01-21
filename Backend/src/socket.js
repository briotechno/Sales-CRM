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

        socket.on('setup', (userData) => {
            // userData should have { id: employeeId, type: 'employee' }
            const userKey = `${userData.id}_${userData.type}`;
            socket.join(userKey);
            onlineUsers.set(userKey, socket.id);
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
            const chat = newMessage.conversationId;
            const participants = newMessage.participants; // [ {id, type}, {id, type} ]

            if (!participants) return console.log('Participants not defined');

            // Persist message if not already saved via REST
            if (!newMessage.id) {
                const messageId = await Messenger.saveMessage({
                    conversation_id: chat,
                    sender_id: newMessage.sender.id,
                    sender_type: newMessage.sender.type,
                    text: newMessage.text,
                    message_type: newMessage.messageType || 'text',
                    reply_to_id: newMessage.replyToId
                });
                newMessage.id = messageId;
            }

            // Broadcast to other participants
            participants.forEach(p => {
                if (p.id === newMessage.sender.id && p.type === newMessage.sender.type) return;

                const userKey = `${p.id}_${p.type}`;
                // Send to participant's personal room (for multi-device sync)
                socket.in(userKey).emit('message_received', newMessage);
                // Also send to conversation room if active
                socket.in(chat).emit('message_received', newMessage);
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
