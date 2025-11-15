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
    Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import PersonIcon from '@mui/icons-material/Person';
import HotelIcon from '@mui/icons-material/Hotel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { TableSkeleton } from '../components/LoadingSkeletons';

function HousekeepingRequestsList() {
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
                ? 'http://localhost:8080/api/staff/housekeeping-requests'
                : `http://localhost:8080/api/staff/housekeeping-requests/status/${statusFilter}`;

            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            setRequests(response.data);
        } catch (err) {
            console.error('Eroare la preluarea cererilor:', err);
            setError('Nu s-au putut încărca cererile de housekeeping.');
            showToast('Eroare la încărcarea cererilor', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            await axios.patch(
                `http://localhost:8080/api/staff/housekeeping-requests/${requestId}/status`,
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

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'HIGH': return 'error';
            case 'NORMAL': return 'info';
            case 'LOW': return 'default';
            default: return 'default';
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

    const getTypeIcon = (type) => {
        switch(type) {
            case 'CLEANING': return '🧹';
            case 'MAINTENANCE': return '🔧';
            case 'SUPPLIES': return '📦';
            default: return '🛎️';
        }
    };

    if (loading) return <TableSkeleton />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                        <CleaningServicesIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            Housekeeping
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {requests.length} {requests.length === 1 ? 'cerere' : 'cereri'} {statusFilter !== 'ALL' ? statusFilter.toLowerCase() : 'totale'}
                        </Typography>
                    </Box>
                </Box>
                <ToggleButtonGroup
                    value={statusFilter}
                    exclusive
                    onChange={(e, value) => value && setStatusFilter(value)}
                    size="small"
                    sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
                >
                    <ToggleButton value="ALL">Toate</ToggleButton>
                    <ToggleButton value="PENDING">Pending</ToggleButton>
                    <ToggleButton value="IN_PROGRESS">În Progres</ToggleButton>
                    <ToggleButton value="COMPLETED">Completate</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {requests.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 8,
                        textAlign: 'center',
                        borderRadius: 3,
                        border: '2px dashed',
                        borderColor: 'divider',
                        bgcolor: 'background.default'
                    }}
                >
                    <CleaningServicesIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Nu există cereri de housekeeping
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                        Cererile vor apărea aici când clienții le vor trimite din aplicația iOS
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {requests.map((request, index) => (
                        <Grid item xs={12} md={6} lg={4} key={request.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    elevation={2}
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        transition: 'all 0.3s',
                                        border: '1px solid',
                                        borderColor: request.priority === 'HIGH' ? 'error.main' : 'divider',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 6,
                                            borderColor: 'success.main'
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <Chip
                                                    label={`#${request.id}`}
                                                    size="small"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                                <Chip
                                                    icon={<PriorityHighIcon fontSize="small" />}
                                                    label={request.priority}
                                                    color={getPriorityColor(request.priority)}
                                                    size="small"
                                                />
                                            </Box>
                                            <Chip
                                                icon={<span>{getStatusIcon(request.status)}</span>}
                                                label={request.status}
                                                color={getStatusColor(request.status)}
                                                size="small"
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <Typography variant="h5">
                                                {getTypeIcon(request.requestType)}
                                            </Typography>
                                            <Typography variant="h6" fontWeight={600}>
                                                {request.requestType}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                minHeight: 40,
                                                mb: 2,
                                                display: '-webkit-box',
                                                overflow: 'hidden',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 2
                                            }}
                                        >
                                            {request.description || 'Fără descriere'}
                                        </Typography>

                                        <Divider sx={{ my: 2 }} />

                                        <Stack spacing={1.5}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {request.guest?.name || 'N/A'}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <HotelIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    Camera {request.room?.number || 'N/A'}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AccessTimeIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(request.createdAt).toLocaleString('ro-RO', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                                            {request.status === 'PENDING' && (
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    onClick={() => handleStatusChange(request.id, 'IN_PROGRESS')}
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    Începe
                                                </Button>
                                            )}
                                            {request.status === 'IN_PROGRESS' && (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleStatusChange(request.id, 'COMPLETED')}
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    Completează
                                                </Button>
                                            )}
                                            {request.status === 'COMPLETED' && (
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    disabled
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    Finalizat
                                                </Button>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

export default HousekeepingRequestsList;
