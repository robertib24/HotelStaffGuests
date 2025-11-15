import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import {
    Paper,
    Box,
    Chip,
    CircularProgress,
    Alert,
    ToggleButton,
    ToggleButtonGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button
} from '@mui/material';
import { motion } from 'framer-motion';
import BuildIcon from '@mui/icons-material/Build';
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

    if (loading) return <TableSkeleton />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BuildIcon fontSize="large" color="primary" />
                    Cereri Housekeeping
                </Typography>
                <ToggleButtonGroup
                    value={statusFilter}
                    exclusive
                    onChange={(e, value) => value && setStatusFilter(value)}
                    size="small"
                >
                    <ToggleButton value="ALL">Toate</ToggleButton>
                    <ToggleButton value="PENDING">Pending</ToggleButton>
                    <ToggleButton value="IN_PROGRESS">În Progres</ToggleButton>
                    <ToggleButton value="COMPLETED">Completate</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Oaspete</TableCell>
                            <TableCell>Cameră</TableCell>
                            <TableCell>Tip</TableCell>
                            <TableCell>Descriere</TableCell>
                            <TableCell>Prioritate</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Acțiuni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request) => (
                            <motion.tr
                                key={request.id}
                                component={TableRow}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <TableCell>{request.id}</TableCell>
                                <TableCell>{request.guest?.name || 'N/A'}</TableCell>
                                <TableCell>{request.room?.number || 'N/A'}</TableCell>
                                <TableCell>{request.requestType}</TableCell>
                                <TableCell>{request.description || '-'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={request.priority}
                                        color={getPriorityColor(request.priority)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{new Date(request.createdAt).toLocaleString('ro-RO')}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={request.status}
                                        color={getStatusColor(request.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {request.status === 'PENDING' && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleStatusChange(request.id, 'IN_PROGRESS')}
                                            >
                                                Începe
                                            </Button>
                                        )}
                                        {request.status === 'IN_PROGRESS' && (
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleStatusChange(request.id, 'COMPLETED')}
                                            >
                                                Completează
                                            </Button>
                                        )}
                                    </Box>
                                </TableCell>
                            </motion.tr>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {requests.length === 0 && (
                <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
                    <BuildIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Nu există cereri de housekeeping
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}

export default HousekeepingRequestsList;
