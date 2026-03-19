const { pool } = require('../config/db');

const notificationController = {
    // Get notifications for the current user
    getNotifications: async (req, res) => {
        try {
            const userId = req.user._id || req.user.id;
            const userType = (req.user.role === 'Admin' || req.user.role === 'Super Admin') ? 'user' : 'employee';
            
            const [rows] = await pool.query(
                'SELECT * FROM notifications WHERE user_id = ? AND user_type = ? ORDER BY created_at DESC LIMIT 50',
                [userId, userType]
            );
            
            res.status(200).json({
                success: true,
                notifications: rows
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Mark a notification as read
    markAsRead: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user._id || req.user.id;
            const userType = (req.user.role === 'Admin' || req.user.role === 'Super Admin') ? 'user' : 'employee';
            
            await pool.query(
                'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ? AND user_type = ?',
                [id, userId, userType]
            );
            
            res.status(200).json({
                success: true,
                message: 'Notification marked as read'
            });
        } catch (error) {
            console.error('Error updating notification:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Mark all as read
    markAllAsRead: async (req, res) => {
        try {
            const userId = req.user._id || req.user.id;
            const userType = (req.user.role === 'Admin' || req.user.role === 'Super Admin') ? 'user' : 'employee';
            
            await pool.query(
                'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND user_type = ?',
                [userId, userType]
            );
            
            res.status(200).json({
                success: true,
                message: 'All notifications marked as read'
            });
        } catch (error) {
            console.error('Error updating notifications:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Delete a notification
    deleteNotification: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user._id || req.user.id;
            const userType = (req.user.role === 'Admin' || req.user.role === 'Super Admin') ? 'user' : 'employee';
            
            await pool.query(
                'DELETE FROM notifications WHERE id = ? AND user_id = ? AND user_type = ?',
                [id, userId, userType]
            );
            
            res.status(200).json({
                success: true,
                message: 'Notification deleted'
            });
        } catch (error) {
            console.error('Error deleting notification:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Clear all read notifications
    clearRead: async (req, res) => {
        try {
            const userId = req.user._id || req.user.id;
            const userType = (req.user.role === 'Admin' || req.user.role === 'Super Admin') ? 'user' : 'employee';
            
            await pool.query(
                'DELETE FROM notifications WHERE user_id = ? AND user_type = ? AND is_read = TRUE',
                [userId, userType]
            );
            
            res.status(200).json({
                success: true,
                message: 'Read notifications cleared'
            });
        } catch (error) {
            console.error('Error clearing notifications:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // HELPER: Create a new notification (not exposed as route directly for users)
    createNotification: async (userId, userType, type, title, message, priority = 'medium', icon = 'Bell') => {
        try {
            const [result] = await pool.query(
                'INSERT INTO notifications (user_id, user_type, type, title, message, priority, icon) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, userType, type, title, message, priority, icon]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error creating notification in DB:', error);
            return null;
        }
    }
};

module.exports = notificationController;
