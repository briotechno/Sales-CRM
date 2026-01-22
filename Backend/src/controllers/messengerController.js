const Messenger = require('../models/messengerModel');
const Employee = require('../models/employeeModel');
const Client = require('../models/clientModel');
const { pool } = require('../config/db');

const messengerController = {
    // Get all potential contacts (Employees and Clients)
    getContacts: async (req, res) => {
        try {
            const orgId = req.user.id; // Admin ID (tenant ID)
            const currentUserRole = req.user.role;
            const currentSubId = currentUserRole === 'Employee' ? req.user._id : req.user.id;
            const currentType = currentUserRole === 'Employee' ? 'employee' : 'user';

            // Get all employees for this org (Admin who created them)
            const [employees] = await pool.query(`
                SELECT e.id, e.employee_name, e.employee_id, e.email, e.mobile_number,
                       e.profile_picture, e.status, d.department_name, deg.designation_name
                FROM employees e
                LEFT JOIN departments d ON e.department_id = d.id
                LEFT JOIN designations deg ON e.designation_id = deg.id
                WHERE e.user_id = ?
                ORDER BY e.employee_name ASC
            `, [orgId]);

            const team = employees
                .filter(emp => !(currentUserRole === 'Employee' && emp.id === currentSubId))
                .map(emp => ({
                    id: emp.id,
                    name: emp.employee_name,
                    role: emp.designation_name || 'Employee',
                    avatar: emp.employee_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
                    status: emp.status === 'Active' ? 'online' : 'offline',
                    email: emp.email,
                    phone: emp.mobile_number || 'N/A',
                    type: 'employee',
                    unread: 0
                }));

            // If current user is NOT an Admin, add the Admin as a contact
            if (currentUserRole !== 'Admin' && currentUserRole !== 'Super Admin') {
                const [admin] = await pool.query('SELECT id, firstName, lastName, email, mobileNumber FROM users WHERE id = ?', [orgId]);
                if (admin[0]) {
                    team.unshift({
                        id: admin[0].id,
                        name: `${admin[0].firstName} ${admin[0].lastName} (Admin)`,
                        role: 'Administrator',
                        avatar: (admin[0].firstName[0] + (admin[0].lastName[0] || '')).toUpperCase(),
                        status: 'online',
                        email: admin[0].email,
                        phone: admin[0].mobileNumber,
                        type: 'user',
                        unread: 0
                    });
                }
            }

            // Get all clients
            const clients = await Client.findAll(orgId);

            // Get conversations for unread counts and last messages
            const conversations = await Messenger.getConversations(currentSubId, currentType);

            const enrichContact = (contact) => {
                const conv = conversations.find(c =>
                    parseInt(c.other_id) === parseInt(contact.id) &&
                    c.other_type === contact.type
                );
                if (conv) {
                    return {
                        ...contact,
                        unread: conv.unread_count || 0,
                        lastMessage: conv.last_message_text,
                        time: conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                        updated_at: conv.last_message_time
                    };
                }
                return contact;
            };

            const enrichedTeam = team.map(enrichContact).sort((a, b) => {
                if (a.updated_at && b.updated_at) return new Date(b.updated_at) - new Date(a.updated_at);
                if (a.updated_at) return -1;
                if (b.updated_at) return 1;
                return 0;
            });

            const enrichedClients = clients.map(c => enrichContact({
                id: c.id,
                name: c.company_name || `${c.first_name} ${c.last_name}`,
                role: c.type === 'organization' ? 'Organization' : 'Individual Client',
                avatar: (c.company_name || c.first_name).substring(0, 2).toUpperCase(),
                status: c.status === 'active' ? 'online' : 'offline',
                email: c.email,
                phone: c.phone,
                type: 'client',
                unread: 0
            })).sort((a, b) => {
                if (a.updated_at && b.updated_at) return new Date(b.updated_at) - new Date(a.updated_at);
                if (a.updated_at) return -1;
                if (b.updated_at) return 1;
                return 0;
            });

            res.status(200).json({
                success: true,
                team: enrichedTeam,
                clients: enrichedClients
            });
        } catch (error) {
            console.error('Error fetching contacts:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    },

    // Get message history for a conversation
    getChatHistory: async (req, res) => {
        try {
            const { otherId, otherType } = req.params;
            const currentUserRole = req.user.role;
            const currentSubId = currentUserRole === 'Employee' ? req.user._id : req.user.id;
            const currentType = currentUserRole === 'Employee' ? 'employee' : 'user';

            const conversation = await Messenger.getOrCreateConversation(
                currentSubId, currentType,
                parseInt(otherId), otherType
            );

            const messages = await Messenger.getMessages(conversation.id);

            // Mark as read
            await Messenger.markAsRead(conversation.id, currentSubId, currentType);

            res.status(200).json({
                success: true,
                conversationId: conversation.id,
                messages: messages
            });
        } catch (error) {
            console.error('Error fetching chat history:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Send a message via REST (for attachments or if socket fails)
    sendMessage: async (req, res) => {
        try {
            const { conversationId, text, messageType, otherId, otherType } = req.body;
            const currentUserRole = req.user.role;
            const currentSubId = currentUserRole === 'Employee' ? req.user._id : req.user.id;
            const currentType = currentUserRole === 'Employee' ? 'employee' : 'user';

            let finalConversationId = conversationId;

            if (!finalConversationId && otherId) {
                const conversation = await Messenger.getOrCreateConversation(
                    currentSubId, currentType,
                    parseInt(otherId), otherType
                );
                finalConversationId = conversation.id;
            }

            const messageId = await Messenger.saveMessage({
                conversation_id: finalConversationId,
                sender_id: currentSubId,
                sender_type: currentType,
                text,
                message_type: messageType || 'text',
                file_url: req.file ? req.file.path : null,
                file_name: req.file ? req.file.originalname : null,
                file_size: req.file ? `${(req.file.size / 1024).toFixed(2)} KB` : null
            });

            // Get the saved message with sender info and formatted time
            const [savedMsg] = await pool.query(`
                SELECT m.*, 
                COALESCE(e.employee_name, CONCAT(u.firstName, ' ', u.lastName)) as sender_name,
                DATE_FORMAT(m.created_at, '%h:%i %p') as time
                FROM messenger_messages m
                LEFT JOIN employees e ON m.sender_id = e.id AND m.sender_type = 'employee'
                LEFT JOIN users u ON m.sender_id = u.id AND m.sender_type = 'user'
                WHERE m.id = ?
            `, [messageId]);

            res.status(201).json({
                success: true,
                message: savedMsg[0]
            });
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get recent conversations
    getRecentChats: async (req, res) => {
        try {
            const currentUserRole = req.user.role;
            const currentSubId = currentUserRole === 'Employee' ? req.user._id : req.user.id;
            const currentType = currentUserRole === 'Employee' ? 'employee' : 'user';

            const conversations = await Messenger.getConversations(currentSubId, currentType);

            // Fetch info for the "other" participant
            const enrichedConversations = await Promise.all(conversations.map(async (conv) => {
                let otherInfo = {};
                if (conv.other_type === 'employee') {
                    const [emp] = await pool.query('SELECT employee_name, email FROM employees WHERE id = ?', [conv.other_id]);
                    if (emp[0]) {
                        otherInfo = {
                            name: emp[0].employee_name,
                            avatar: emp[0].employee_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
                            role: 'Employee'
                        };
                    }
                } else if (conv.other_type === 'user') {
                    const [adm] = await pool.query('SELECT firstName, lastName, email FROM users WHERE id = ?', [conv.other_id]);
                    if (adm[0]) {
                        otherInfo = {
                            name: `${adm[0].firstName} ${adm[0].lastName} (Admin)`,
                            avatar: (adm[0].firstName[0] + (adm[0].lastName[0] || '')).toUpperCase(),
                            role: 'Administrator'
                        };
                    }
                } else if (conv.other_type === 'client') {
                    const orgId = req.user.id;
                    const c = await Client.findById(conv.other_id, orgId);
                    if (c) {
                        otherInfo = {
                            name: c.company_name || `${c.first_name} ${c.last_name}`,
                            avatar: (c.company_name || c.first_name).substring(0, 2).toUpperCase(),
                            role: 'Client'
                        };
                    }
                }

                return {
                    ...conv,
                    ...otherInfo
                };
            }));

            res.status(200).json({
                success: true,
                conversations: enrichedConversations
            });
        } catch (error) {
            console.error('Error fetching recent chats:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
};

module.exports = messengerController;
