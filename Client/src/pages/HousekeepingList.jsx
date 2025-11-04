import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Typography, Paper, Box, Button, Chip, Grid, CircularProgress, Alert, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { motion } from 'framer-motion';
import KingBedIcon from '@mui/icons-material/KingBed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

function RoomStatusCard({ room, onUpdateStatus }) {
    const isDirty = room.status === 'Necesită Curățenie';
    const auth = useAuth();
    const canUpdate = auth.user?.role === 'ROLE_Admin' || auth.user?.role === 'ROLE_Manager' || auth.user?.role === 'ROLE_Cleaner';

    const handleUpdate = () => {
        const newStatus = isDirty ? 'Curat' : 'Necesită Curățenie';
        onUpdateStatus(room.id, newStatus);
    };

    const getRoomTypeColor = (type) => {
        const colors = {
            'Single': '#3b82f6', 'Double': '#8b5cf6', 'Suite': '#f59e0b',
            'Deluxe': '#ef4444', 'Presidential': '#ec4899'
        };
        return colors[type] || '#6b7280';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
            <Paper 
                sx={{ 
                    p: 2.5, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    height: '100%',
                    borderLeft: `5px solid ${isDirty ? '#f59e0b' : '#10b981'}`,
                    background: isDirty ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <KingBedIcon sx={{ fontSize: 28, color: getRoomTypeColor(room.type) }} />
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Camera {room.number}</Typography>
                            <Chip 
                                label={room.type}
                                size="small"
                                sx={{
                                    background: `${getRoomTypeColor(room.type)}20`,
                                    color: getRoomTypeColor(room.type),
                                    fontWeight: 'bold',
                                    border: `1px solid ${getRoomTypeColor(room.type)}40`,
                                }}
                            />
                        </Box>
                    </Box>
                    <Chip
                        icon={isDirty ? <CleaningServicesIcon /> : <CheckCircleIcon />}
                        label={room.status}
                        size="small"
                        color={isDirty ? 'warning' : 'success'}
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>
                {canUpdate && (
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleUpdate}
                        color={isDirty ? 'warning' : 'success'}
                        startIcon={isDirty ? <CheckCircleIcon /> : <CleaningServicesIcon />}
                        sx={{
                            background: isDirty ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            boxShadow: `0 4px 16px ${isDirty ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                            }
                        }}
                    >
                        {isDirty ? 'Marchează "Curat"' : 'Marchează "Necesită Curățenie"'}
                    </Button>
                )}
            </Paper>
        </motion.div>
    );
}

function HousekeepingList() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewStatus, setViewStatus] = useState('Necesită Curățenie');
    const auth = useAuth();

    useEffect(() => {
        if (!auth.token) {
            setLoading(true);
            return;
        }

        const fetchRooms = async (status) => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://localhost:8080/api/rooms/status/${status}`, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                setRooms(response.data);
            } catch (err) {
                console.error('Eroare la preluarea camerelor:', err);
                if (err.response?.status === 403) {
                    setError('Nu aveți permisiunea de a vedea aceste date.');
                } else {
                    setError('Nu s-au putut încărca datele camerelor.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRooms(viewStatus);

    }, [auth.token, viewStatus]);

    const handleUpdateStatus = async (roomId, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/api/rooms/${roomId}/status`, { status: newStatus }, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
        } catch (err) {
            console.error('Eroare la actualizarea statusului:', err);
            setError('Eroare la actualizarea statusului.');
        }
    };

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setViewStatus(newView);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
        >
            <Paper 
                sx={{ 
                    p: 4, 
                    width: '100%',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(220, 38, 38, 0.06) 100%)',
                    border: '1.5px solid rgba(239, 68, 68, 0.25)',
                    position: 'relative',
                    minHeight: '80vh',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                    }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>🧹</span> Management Curățenie
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Vezi și actualizează statusul camerelor
                        </Typography>
                    </Box>
                    <ToggleButtonGroup
                        color="primary"
                        value={viewStatus}
                        exclusive
                        onChange={handleViewChange}
                        aria-label="Platform"
                    >
                        <ToggleButton value="Necesită Curățenie" color="warning">
                            <CleaningServicesIcon sx={{ mr: 1, fontSize: 20 }} />
                            Necesită Curățenie
                        </ToggleButton>
                        <ToggleButton value="Curat" color="success">
                            <CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
                            Curat
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : rooms.length === 0 ? (
                    <Alert severity="success">Nicio cameră nu are statusul "{viewStatus}".</Alert>
                ) : (
                    <Grid container spacing={3}>
                        {rooms.map(room => (
                            <Grid item xs={12} sm={6} md={4} key={room.id}>
                                <RoomStatusCard room={room} onUpdateStatus={handleUpdateStatus} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </motion.div>
    );
}

export default HousekeepingList;