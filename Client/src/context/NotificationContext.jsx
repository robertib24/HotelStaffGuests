import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Badge, IconButton, Menu, Box, Typography, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const savedNotifications = localStorage.getItem('hotel_notifications');
        if (savedNotifications) {
            try {
                setNotifications(JSON.parse(savedNotifications));
            } catch (e) {
                console.error('Error loading notifications:', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('hotel_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        };
        
        console.log('Adding notification:', newNotification);
        
        setNotifications(prev => {
            const updated = [newNotification, ...prev];
            console.log('Updated notifications:', updated);
            return updated;
        });
    }, []);

    const markAsRead = useCallback((id) => {
        setNotifications(prev => 
            prev.map(notif => 
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => 
            prev.map(notif => ({ ...notif, read: true }))
        );
    }, []);

    const deleteNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
        localStorage.removeItem('hotel_notifications');
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getNotificationIcon = (type) => {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            NEW_GUEST_REGISTRATION: '🎉',
            RESERVATION_CANCELLED: '🚫',
            reservation: '📅',
            payment: '💰',
            room: '🛏️'
        };
        return icons[type] || 'ℹ️';
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Acum';
        if (diffMins < 60) return `${diffMins} min`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} ore`;
        return `${Math.floor(diffMins / 1440)} zile`;
    };

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            addNotification, 
            markAsRead, 
            markAllAsRead,
            deleteNotification,
            clearAll,
            unreadCount 
        }}>
            {children}

            <IconButton
                onClick={handleClick}
                sx={{
                    position: 'fixed',
                    top: 80,
                    right: 24,
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    '&:hover': {
                        bgcolor: 'background.paper',
                        transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                    zIndex: 1000,
                }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 380,
                        maxHeight: 500,
                        borderRadius: 2,
                    }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">
                        Notificări ({unreadCount})
                    </Typography>
                    {notifications.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Typography
                                variant="caption"
                                sx={{ cursor: 'pointer', color: 'primary.main' }}
                                onClick={() => {
                                    markAllAsRead();
                                }}
                            >
                                Marchează toate
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ cursor: 'pointer', color: 'error.main' }}
                                onClick={() => {
                                    clearAll();
                                    handleClose();
                                }}
                            >
                                Șterge toate
                            </Typography>
                        </Box>
                    )}
                </Box>
                <Divider />

                {notifications.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            Nicio notificare
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                        <AnimatePresence>
                            {notifications.map((notif) => (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <Box
                                        onClick={() => {
                                            markAsRead(notif.id);
                                        }}
                                        sx={{
                                            p: 2,
                                            cursor: 'pointer',
                                            bgcolor: notif.read ? 'transparent' : 'rgba(59, 130, 246, 0.1)',
                                            borderLeft: notif.read ? 'none' : '4px solid #3b82f6',
                                            '&:hover': {
                                                bgcolor: 'rgba(59, 130, 246, 0.15)',
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                                            <Typography sx={{ fontSize: 20 }}>
                                                {getNotificationIcon(notif.type)}
                                            </Typography>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" fontWeight={notif.read ? 'normal' : 'bold'}>
                                                    {notif.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {notif.message}
                                                </Typography>
                                                <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'primary.main' }}>
                                                    {formatTimestamp(notif.timestamp)}
                                                </Typography>
                                            </Box>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notif.id);
                                                }}
                                                sx={{ ml: 1 }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Divider />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </Box>
                )}
            </Menu>
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
}