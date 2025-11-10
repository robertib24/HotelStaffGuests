import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Snackbar, Alert, Badge, IconButton, Menu, MenuItem, Box, Typography, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    useEffect(() => {
        const savedNotifications = localStorage.getItem('notifications');
        if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        };
        setNotifications(prev => [newNotification, ...prev]);
        
        setToast({
            open: true,
            message: notification.message,
            severity: notification.type || 'info'
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
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{ cursor: 'pointer', color: 'primary.main', mr: 2 }}
                                onClick={() => {
                                    markAllAsRead();
                                    handleClose();
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
                                    <MenuItem
                                        onClick={() => {
                                            markAsRead(notif.id);
                                        }}
                                        sx={{
                                            bgcolor: notif.read ? 'transparent' : 'rgba(59, 130, 246, 0.1)',
                                            borderLeft: notif.read ? 'none' : '4px solid #3b82f6',
                                            '&:hover': {
                                                bgcolor: 'rgba(59, 130, 246, 0.15)',
                                            }
                                        }}
                                    >
                                        <Box sx={{ width: '100%' }}>
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
                                                    ×
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                    <Divider />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </Box>
                )}
            </Menu>

            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ mt: 8 }}
            >
                <Alert 
                    onClose={() => setToast(prev => ({ ...prev, open: false }))} 
                    severity={toast.severity}
                    variant="filled"
                    sx={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
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