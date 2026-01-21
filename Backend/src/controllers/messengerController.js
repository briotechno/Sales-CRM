const Messenger = require('../models/messengerModel');
const Employee = require('../models/employeeModel');
const Client = require('../models/clientModel');
const { pool } = require('../config/db');

const messengerController = {
    // Get all potential contacts (Employees and Clients)
    getContacts: async (req, res) => {
        try {
            const currentUserId = req.user.id;

            // Get current employee's ID to exclude them from the list
            const [currentEmp] = await pool.query('SELECT id FROM employees WHERE user_id = ? LIMIT 1', [currentUserId]);
            const currentEmployeeId = currentEmp[0]?.id;

            // Get all employees from the same organization (excluding current employee)
            const [employees] = await pool.query(`
                SELECT e.id, e.employee_name, e.employee_id, e.email, e.mobile_number,
                       e.profile_picture, e.status, d.department_name, deg.designation_name
                FROM employees e
                LEFT JOIN departments d ON e.department_id = d.id
                LEFT JOIN designations deg ON e.designation_id = deg.id
                WHERE e.user_id = ? AND e.id != ?
                ORDER BY e.employee_name ASC
            `, [currentUserId, currentEmployeeId || 0]);

            // Get all clients
            const clients = await Client.findAll(currentUserId);

            res.status(200).json({
                success: true,
                team: employees.map(emp => ({
                    id: emp.id,
                    name: emp.employee_name,
                    role: emp.designation_name || 'Employee',
                    avatar: emp.employee_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
                    status: emp.status === 'Active' ? 'online' : 'offline',
                    email: emp.email,
                    phone: emp.mobile_number || 'N/A',
                    type: 'employee',
                    lastMessage: '',
                    time: '',
                    unread: 0
                })),
                clients: clients.map(c => ({
                    id: c.id,
                    name: c.company_name || `${c.first_name} ${c.last_name}`,
                    role: c.type === 'organization' ? 'Organization' : 'Individual Client',
                    avatar: (c.company_name || c.first_name).substring(0, 2).toUpperCase(),
                    status: c.status === 'active' ? 'online' : 'offline',
                    email: c.email,
                    phone: c.phone,
                    type: 'client',
                    lastMessage: '',
                    time: '',
                    unread: 0
                }))
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
            const currentUserId = req.user.id;

            // Get current employee's ID
            const [currentEmp] = await pool.query('SELECT id FROM employees WHERE user_id = ? LIMIT 1', [currentUserId]);
            const currentEmployeeId = currentEmp[0]?.id;

            const conversation = await Messenger.getOrCreateConversation(
                currentEmployeeId, 'employee',
                parseInt(otherId), otherType
            );

            const messages = await Messenger.getMessages(conversation.id);

            // Mark as read
            await Messenger.markAsRead(conversation.id, currentEmployeeId, 'employee');

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
            const currentUserId = req.user.id;

            // Get current employee's ID
            const [currentEmp] = await pool.query('SELECT id FROM employees WHERE user_id = ? LIMIT 1', [currentUserId]);
            const currentEmployeeId = currentEmp[0]?.id;

            let finalConversationId = conversationId;

            if (!finalConversationId && otherId) {
                const conversation = await Messenger.getOrCreateConversation(
                    currentEmployeeId, 'employee',
                    parseInt(otherId), otherType
                );
                finalConversationId = conversation.id;
            }

            const messageId = await Messenger.saveMessage({
                conversation_id: finalConversationId,
                sender_id: currentEmployeeId,
                sender_type: 'employee',
                text,
                message_type: messageType || 'text',
                file_url: req.file ? req.file.path : null,
                file_name: req.file ? req.file.originalname : null,
                file_size: req.file ? `${(req.file.size / 1024).toFixed(2)} KB` : null
            });

            res.status(201).json({
                success: true,
                messageId
            });
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get recent conversations
    getRecentChats: async (req, res) => {
        try {
            const currentUserId = req.user.id;

            // Get current employee's ID
            const [currentEmp] = await pool.query('SELECT id FROM employees WHERE user_id = ? LIMIT 1', [currentUserId]);
            const currentEmployeeId = currentEmp[0]?.id;

            const conversations = await Messenger.getConversations(currentEmployeeId, 'employee');

            // Fetch info for the "other" participant
            const enrichedConversations = await Promise.all(conversations.map(async (conv) => {
                let otherInfo = {};
                if (conv.other_type === 'employee') {
                    const [emp] = await pool.query('SELECT employee_name, email FROM employees WHERE id = ?', [conv.other_id]);
                    if (emp[0]) {
                        otherInfo = {
                            name: emp[0].employee_name,
                            avatar: emp[0].employee_name.substring(0, 2).toUpperCase(),
                            role: 'Employee'
                        };
                    }
                } else if (conv.other_type === 'client') {
                    const c = await Client.findById(conv.other_id, currentUserId);
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
