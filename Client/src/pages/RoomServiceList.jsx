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
    Fade,
    Zoom,
    LinearProgress
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
            case 'PENDING': return 'warning';
            case 'IN_PROGRESS': return 'info';
            case 'COMPLETED': return 'success';
            default: return 'default';
        }
    };

    const getStatusGradient = (status) => {
        switch(status) {
            case 'PENDING': return 'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)';
            case 'IN_PROGRESS': return 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)';
            case 'COMPLETED': return 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)';
            default: return 'linear-gradient(135deg, #BDBDBD 0%, #9E9E9E 100%)';
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Box sx={{ mb: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                        <Avatar
                            sx={{
                                bgcolor: 'transparent',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                width: 70,
                                height: 70,
                                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                            }}
                        >
                            <RoomServiceIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Box>
                            <Typography
                                variant="h3"
                                fontWeight="800"
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Room Service
                            </Typography>
                            <Typography variant="body1" color="text.secondary" fontWeight="500">
                                Gestionare comenzi și solicitări
                            </Typography>
                        </Box>
                    </Box>
                </motion.div>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                        { label: 'Total', value: stats.total, color: '#667eea', icon: '📊' },
                        { label: 'Pending', value: stats.pending, color: '#FB8C00', icon: '⏳' },
                        { label: 'În Progres', value: stats.inProgress, color: '#1E88E5', icon: '🔄' },
                        { label: 'Completate', value: stats.completed, color: '#43A047', icon: '✅' }
                    ].map((stat, index) => (
                        <Grid item xs={6} md={3} key={stat.label}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        borderRadius: 3,
                                        background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`,
                                        border: `2px solid ${stat.color}30`,
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: `0 12px 28px ${stat.color}25`
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Typography variant="h4">{stat.icon}</Typography>
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold" color={stat.color}>
                                                {stat.value}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight="600">
                                                {stat.label}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ToggleButtonGroup
                        value={statusFilter}
                        exclusive
                        onChange={(e, value) => value && setStatusFilter(value)}
                        size="small"
                        sx={{
                            bgcolor: 'background.paper',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            borderRadius: 2,
                            '& .MuiToggleButton-root': {
                                border: 'none',
                                borderRadius: 2,
                                fontWeight: 600
                            }
                        }}
                    >
                        <ToggleButton value="ALL">Toate</ToggleButton>
                        <ToggleButton value="PENDING">Pending</ToggleButton>
                        <ToggleButton value="IN_PROGRESS">În Progres</ToggleButton>
                        <ToggleButton value="COMPLETED">Completate</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>

            {requests.length === 0 ? (
                <Fade in={true} timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 10,
                            textAlign: 'center',
                            borderRadius: 4,
                            border: '3px dashed',
                            borderColor: 'divider',
                            bgcolor: 'rgba(102, 126, 234, 0.02)'
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
                            <RoomServiceIcon sx={{ fontSize: 100, color: 'text.disabled', mb: 3 }} />
                        </motion.div>
                        <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="600">
                            Nu există cereri de room service
                        </Typography>
                        <Typography variant="body1" color="text.disabled">
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
                                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{
                                        delay: index * 0.08,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{ y: -8 }}
                                >
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            borderRadius: 4,
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: '2px solid',
                                            borderColor: 'divider',
                                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
                                                borderColor: 'primary.main',
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
                                                height: '4px',
                                                background: getStatusGradient(request.status),
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
                                                        fontSize: '0.85rem',
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        color: 'white'
                                                    }}
                                                />
                                                <Chip
                                                    icon={<span style={{ fontSize: '1rem' }}>{getStatusIcon(request.status)}</span>}
                                                    label={request.status}
                                                    color={getStatusColor(request.status)}
                                                    size="small"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </Box>

                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: 700,
                                                    minHeight: 64,
                                                    display: '-webkit-box',
                                                    overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 2,
                                                    mb: 2,
                                                    color: '#2d3748'
                                                }}
                                            >
                                                {request.request}
                                            </Typography>

                                            <Divider sx={{ my: 2.5, borderColor: 'rgba(102, 126, 234, 0.1)' }} />

                                            <Stack spacing={2}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea20' }}>
                                                        <PersonIcon fontSize="small" sx={{ color: '#667eea' }} />
                                                    </Avatar>
                                                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                                                        {request.guest?.name || 'N/A'}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#764ba220' }}>
                                                        <HotelIcon fontSize="small" sx={{ color: '#764ba2' }} />
                                                    </Avatar>
                                                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                                                        Camera {request.room?.number || 'N/A'}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#48bb7820' }}>
                                                        <AccessTimeIcon fontSize="small" sx={{ color: '#48bb78' }} />
                                                    </Avatar>
                                                    <Typography variant="body2" color="text.secondary" fontWeight="500">
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
                                                            borderRadius: 3,
                                                            py: 1.2,
                                                            fontWeight: 'bold',
                                                            borderWidth: 2,
                                                            '&:hover': {
                                                                borderWidth: 2,
                                                                transform: 'scale(1.02)'
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
                                                            borderRadius: 3,
                                                            py: 1.2,
                                                            fontWeight: 'bold',
                                                            background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
                                                            boxShadow: '0 4px 14px rgba(67, 160, 71, 0.4)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)',
                                                                boxShadow: '0 6px 20px rgba(67, 160, 71, 0.5)',
                                                                transform: 'scale(1.02)'
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
                                                        color="success"
                                                        sx={{
                                                            width: '100%',
                                                            py: 1.5,
                                                            fontWeight: 'bold',
                                                            fontSize: '0.9rem'
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
        </motion.div>
    );
}

export default RoomServiceList;
