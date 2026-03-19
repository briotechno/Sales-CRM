const { pool } = require('../config/db');
const { getIO } = require('../socket');

const notificationService = {
    /**
     * Create a notification and push via socket
     * @param {number} userId - ID of the user (employee or admin)
     * @param {string} userType - 'employee' or 'user' (for admin)
     * @param {string} type - 'invoice', 'lead', 'quotation', etc.
     * @param {string} title - Brief title of notification
     * @param {string} message - Content of the notification
     * @param {string} priority - 'low', 'medium', 'high'
     * @param {string} icon - Lucide icon name (e.g., 'Bell', 'DollarSign')
     */
    createNotification: async (userId, userType, type, title, message, priority = 'medium', icon = 'Bell') => {
        try {
            // 1. Save to Database
            const [result] = await pool.query(
                'INSERT INTO notifications (user_id, type, title, message, priority, icon) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, type, title, message, priority, icon]
            );
            
            const notificationId = result.insertId;
            const newNotification = {
                id: notificationId,
                user_id: userId,
                type,
                title,
                message,
                priority,
                icon,
                is_read: false,
                created_at: new Date()
            };

            // 2. Emit via Socket.io using the composite key room
            const io = getIO();
            if (io) {
                const userKey = `${userId}_${userType}`;
                io.to(userKey).emit('new_notification', newNotification);
                console.log(`Notification pushed to user room: ${userKey}`);
            }
            
            return newNotification;
        } catch (error) {
            console.error('Error in Notification Service:', error);
            return null;
        }
    }
};

module.exports = notificationService;
