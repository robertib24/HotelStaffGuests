import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import {
    Paper,
    Box,
    Chip,
    Alert,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Avatar,
    Divider,
    Stack,
    Fade
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import PersonIcon from '@mui/icons-material/Person';
import HotelIcon from '@mui/icons-material/Hotel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { TableSkeleton } from '../components/LoadingSkeletons';

function RoomServiceList() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const auth = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        fetchRequests();
    }, [auth.token, statusFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        setError('');
        try {
            const url = statusFilter === 'ALL'
                ? 'http://localhost:8080/api/staff/room-service-requests'
                : `http://localhost:8080/api/staff/room-service-requests/status/${statusFilter}`;

            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            setRequests(response.data);
        } catch (err) {
            console.error('Eroare la preluarea cererilor:', err);
            setError('Nu s-au putut încărca cererile de room service.');
            showToast('Eroare la încărcarea cererilor', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            await axios.patch(
                `http://localhost:8080/api/staff/room-service-requests/${requestId}/status`,
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${auth.token}` } }
            );
            showToast('Status actualizat cu succes!', 'success');
            fetchRequests();
        } catch (err) {
            console.error('Eroare la actualizarea statusului:', err);
            showToast('Eroare la actualizarea statusului', 'error');
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'PENDING': return '#fbbf24';
            case 'IN_PROGRESS': return '#60a5fa';
            case 'COMPLETED': return '#34d399';
            default: return '#9ca3af';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'PENDING': return '⏳';
            case 'IN_PROGRESS': return '🔄';
            case 'COMPLETED': return '✅';
            default: return '📋';
        }
    };

    if (loading) return <TableSkeleton />;
    if (error) return <Alert severity="error">{error}</Alert>;

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'PENDING').length,
        inProgress: requests.filter(r => r.status === 'IN_PROGRESS').length,
        completed: requests.filter(r => r.status === 'COMPLETED').length
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
            p: 4
        }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 40px rgba(102, 126, 234, 0.5), 0 0 80px rgba(118, 75, 162, 0.3)',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: -2,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                filter: 'blur(20px)',
                                opacity: 0.5,
                                zIndex: -1
                            }
                        }}
                    >
                        <RoomServiceIcon sx={{ fontSize: 45, color: 'white' }} />
                    </Box>
                    <Box>
                        <Typography
                            variant="h3"
                            fontWeight="900"
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 0 30px rgba(102, 126, 234, 0.3)',
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Room Service
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                            Gestionare comenzi și solicitări
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[
                        { label: 'Total', value: stats.total, color: '#667eea', icon: '📊' },
                        { label: 'Pending', value: stats.pending, color: '#fbbf24', icon: '⏳' },
                        { label: 'În Progres', value: stats.inProgress, color: '#60a5fa', icon: '🔄' },
                        { label: 'Completate', value: stats.completed, color: '#34d399', icon: '✅' }
                    ].map((stat, index) => (
                        <Grid item xs={6} md={3} key={stat.label}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        backdropFilter: 'blur(10px)',
                                        border: `1px solid ${stat.color}30`,
                                        transition: 'all 0.3s',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: `0 0 30px ${stat.color}40`,
                                            border: `1px solid ${stat.color}60`
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: stat.color,
                                            boxShadow: `0 0 10px ${stat.color}`
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="h4">{stat.icon}</Typography>
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                                                {stat.value}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                                                {stat.label}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                    <ToggleButtonGroup
                        value={statusFilter}
                        exclusive
                        onChange={(e, value) => value && setStatusFilter(value)}
                        size="small"
                        sx={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 2,
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            '& .MuiToggleButton-root': {
                                border: 'none',
                                color: 'rgba(255,255,255,0.6)',
                                fontWeight: 600,
                                px: 2.5,
                                '&.Mui-selected': {
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)'
                                }
                            }
                        }}
                    >
                        <ToggleButton value="ALL">Toate</ToggleButton>
                        <ToggleButton value="PENDING">Pending</ToggleButton>
                        <ToggleButton value="IN_PROGRESS">În Progres</ToggleButton>
                        <ToggleButton value="COMPLETED">Completate</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </motion.div>

            {requests.length === 0 ? (
                <Fade in={true} timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 10,
                            textAlign: 'center',
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(10px)',
                            border: '2px dashed rgba(102, 126, 234, 0.3)'
                        }}
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            <RoomServiceIcon sx={{ fontSize: 100, color: 'rgba(102, 126, 234, 0.4)', mb: 3 }} />
                        </motion.div>
                        <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, fontWeight: 600 }}>
                            Nu există cereri de room service
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            Cererile vor apărea aici când clienții le vor trimite din aplicația iOS
                        </Typography>
                    </Paper>
                </Fade>
            ) : (
                <Grid container spacing={3}>
                    <AnimatePresence>
                        {requests.map((request, index) => (
                            <Grid item xs={12} md={6} lg={4} key={request.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                                    whileHover={{ y: -8 }}
                                >
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            borderRadius: 4,
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(102, 126, 234, 0.2)',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                boxShadow: '0 0 40px rgba(102, 126, 234, 0.3)',
                                                border: '1px solid rgba(102, 126, 234, 0.5)',
                                                '&::before': {
                                                    width: '100%'
                                                }
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '0%',
                                                height: '3px',
                                                background: `linear-gradient(90deg, ${getStatusColor(request.status)}, ${getStatusColor(request.status)}80)`,
                                                boxShadow: `0 0 15px ${getStatusColor(request.status)}`,
                                                transition: 'width 0.4s ease'
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2.5 }}>
                                                <Chip
                                                    label={`#${request.id}`}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        color: 'white',
                                                        boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)'
                                                    }}
                                                />
                                                <Chip
                                                    icon={<span style={{ fontSize: '1rem' }}>{getStatusIcon(request.status)}</span>}
                                                    label={request.status}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        background: `${getStatusColor(request.status)}20`,
                                                        color: getStatusColor(request.status),
                                                        border: `1px solid ${getStatusColor(request.status)}40`,
                                                        boxShadow: `0 0 15px ${getStatusColor(request.status)}20`
                                                    }}
                                                />
                                            </Box>

                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 700,
                                                    minHeight: 64,
                                                    display: '-webkit-box',
                                                    overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 2,
                                                    mb: 2.5,
                                                    color: 'rgba(255,255,255,0.95)'
                                                }}
                                            >
                                                {request.request}
                                            </Typography>

                                            <Divider sx={{ my: 2.5, borderColor: 'rgba(102, 126, 234, 0.2)' }} />

                                            <Stack spacing={2}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{
                                                        width: 36,
                                                        height: 36,
                                                        background: 'linear-gradient(135deg, #667eea40, #764ba240)',
                                                        border: '1px solid rgba(102, 126, 234, 0.3)'
                                                    }}>
                                                        <PersonIcon fontSize="small" sx={{ color: '#667eea' }} />
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                                                        {request.guest?.name || 'N/A'}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{
                                                        width: 36,
                                                        height: 36,
                                                        background: 'linear-gradient(135deg, #764ba240, #667eea40)',
                                                        border: '1px solid rgba(118, 75, 162, 0.3)'
                                                    }}>
                                                        <HotelIcon fontSize="small" sx={{ color: '#764ba2' }} />
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                                                        Camera {request.room?.number || 'N/A'}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{
                                                        width: 36,
                                                        height: 36,
                                                        background: 'rgba(52, 211, 153, 0.2)',
                                                        border: '1px solid rgba(52, 211, 153, 0.3)'
                                                    }}>
                                                        <AccessTimeIcon fontSize="small" sx={{ color: '#34d399' }} />
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                                                        {new Date(request.createdAt).toLocaleString('ro-RO', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Box sx={{ mt: 3 }}>
                                                {request.status === 'PENDING' && (
                                                    <Button
                                                        fullWidth
                                                        variant="outlined"
                                                        onClick={() => handleStatusChange(request.id, 'IN_PROGRESS')}
                                                        startIcon={<PlayArrowIcon />}
                                                        sx={{
                                                            borderRadius: 2.5,
                                                            py: 1.3,
                                                            fontWeight: 'bold',
                                                            borderWidth: 2,
                                                            borderColor: '#667eea',
                                                            color: '#667eea',
                                                            background: 'rgba(102, 126, 234, 0.1)',
                                                            '&:hover': {
                                                                borderWidth: 2,
                                                                borderColor: '#667eea',
                                                                background: 'rgba(102, 126, 234, 0.2)',
                                                                boxShadow: '0 0 25px rgba(102, 126, 234, 0.4)'
                                                            }
                                                        }}
                                                    >
                                                        Începe Comanda
                                                    </Button>
                                                )}
                                                {request.status === 'IN_PROGRESS' && (
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        onClick={() => handleStatusChange(request.id, 'COMPLETED')}
                                                        startIcon={<CheckCircleOutlineIcon />}
                                                        sx={{
                                                            borderRadius: 2.5,
                                                            py: 1.3,
                                                            fontWeight: 'bold',
                                                            background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                                                            boxShadow: '0 0 30px rgba(52, 211, 153, 0.4)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                boxShadow: '0 0 40px rgba(52, 211, 153, 0.6)'
                                                            }
                                                        }}
                                                    >
                                                        Finalizează Comanda
                                                    </Button>
                                                )}
                                                {request.status === 'COMPLETED' && (
                                                    <Chip
                                                        icon={<CheckCircleOutlineIcon />}
                                                        label="Comandă Finalizată"
                                                        sx={{
                                                            width: '100%',
                                                            py: 1.8,
                                                            fontWeight: 'bold',
                                                            background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                                                            color: 'white',
                                                            boxShadow: '0 0 25px rgba(52, 211, 153, 0.3)'
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            )}
        </Box>
    );
}

export default RoomServiceList;
