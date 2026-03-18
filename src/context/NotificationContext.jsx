import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const NotificationProvider = ({ children }) => {
    const { user: currentUser, token } = useSelector((state) => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const url = API_BASE_URL.endsWith('/') ? `${API_BASE_URL}notifications` : `${API_BASE_URL}/notifications`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.filter(n => !n.is_read).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const markAsRead = async (id) => {
        try {
            const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
            const response = await fetch(`${baseUrl}notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n => n.id === id ? { ...n, is_read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
            const response = await fetch(`${baseUrl}notifications/read-all`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
            const response = await fetch(`${baseUrl}notifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const wasUnread = notifications.find(n => n.id === id && !n.is_read);
                setNotifications(prev => prev.filter(n => n.id !== id));
                if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const clearRead = async () => {
        try {
            const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
            const response = await fetch(`${baseUrl}notifications/clear-read`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(prev => prev.filter(n => !n.is_read));
            }
        } catch (error) {
            console.error('Error clearing read:', error);
        }
    };

    // Socket Setup
    useEffect(() => {
        if (currentUser && token) {
            // Socket requires the root URL, not the /api subpath
            const SOCKET_URL = API_BASE_URL.replace('/api/', '').replace('/api', '');
            
            const newSocket = io(SOCKET_URL, {
                transports: ['websocket'],
                upgrade: false
            });

            newSocket.on('connect', () => {
                console.log('Socket Connected for Notifications');
                // Setup user identifying data
                const isEmployee = currentUser.role === 'Employee';
                const actualId = isEmployee ? (currentUser._id || currentUser.id) : (currentUser.id || currentUser._id);
                const userType = isEmployee ? 'employee' : 'user';

                const userData = {
                    id: actualId,
                    type: userType
                };
                newSocket.emit('setup', userData);
            });

            newSocket.on('new_notification', (notification) => {
                console.log('New notification received:', notification);
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Show Toast
                toast.success(notification.title, {
                    description: notification.message,
                    icon: '🔔',
                    duration: 5000,
                    style: {
                        border: '2px solid #FF7B1D',
                    }
                });

                // Also play sound if needed
            });

            setSocket(newSocket);
            fetchNotifications();

            return () => newSocket.close();
        }
    }, [currentUser, token, fetchNotifications]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            clearRead,
            fetchNotifications,
            socket
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
