import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
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
    TextField,
    InputAdornment,
    Typography,
    Button
} from '@mui/material';
import { motion } from 'framer-motion';
import KingBedIcon from '@mui/icons-material/KingBed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { TableSkeleton } from '../components/LoadingSkeletons';

function HousekeepingList() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewStatus, setViewStatus] = useState('Necesită Curățenie');
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const auth = useAuth();
    const { showToast } = useToast();

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
                const errorMsg = err.response?.status === 403 
                    ? 'Nu aveți permisiunea de a vedea aceste date.' 
                    : 'Nu s-au putut încărca datele camerelor.';
                setError(errorMsg);
                showToast(errorMsg, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms(viewStatus);
    }, [auth.token, viewStatus, showToast]);

    const filteredRooms = useMemo(() => {
        if (debouncedSearchQuery.trim() === '') {
            return rooms;
        }
        return rooms.filter(room => 
            room.number.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            room.type.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
    }, [debouncedSearchQuery, rooms]);

    const handleUpdateStatus = async (roomId, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/api/rooms/${roomId}/status`, 
                { status: newStatus }, 
                { headers: { 'Authorization': `Bearer ${auth.token}` } }
            );
            setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
            showToast(`Statusul camerei a fost actualizat la "${newStatus}"!`, 'success');
        } catch (err) {
            console.error('Eroare la actualizarea statusului:', err);
            showToast('Eroare la actualizarea statusului.', 'error');
        }
    };

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setViewStatus(newView);
            setSearchQuery('');
        }
    };

    const getRoomTypeColor = (type) => {
        const colors = {
            'Single': '#3b82f6', 'Double': '#8b5cf6', 'Suite': '#f59e0b',
            'Deluxe': '#ef4444', 'Presidential': '#ec4899'
        };
        return colors[type] || '#6b7280';
    };

    const canUpdate = auth.user?.role === 'ROLE_Admin' || auth.user?.role === 'ROLE_Manager' || auth.user?.role === 'ROLE_Cleaner';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
        >
            <Paper 
                sx={{ 
                    p: 3, 
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
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 2 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span>🧹</span> Management Curățenie
                            </Typography>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <ToggleButtonGroup
                                color="primary"
                                value={viewStatus}
                                exclusive
                                onChange={handleViewChange}
                                size="small"
                            >
                                <ToggleButton value="Necesită Curățenie" sx={{ px: 2 }}>
                                    <CleaningServicesIcon sx={{ mr: 1, fontSize: 18 }} />
                                    Necesită Curățenie
                                </ToggleButton>
                                <ToggleButton value="Curat" sx={{ px: 2 }}>
                                    <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} />
                                    Curat
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </motion.div>
                    </Box>
                    
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Vezi și actualizează statusul camerelor ({filteredRooms.length} camere)
                        </Typography>
                    </motion.div>

                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Caută după număr sau tip cameră..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {loading ? (
                    <TableSkeleton rows={8} />
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : filteredRooms.length === 0 ? (
                    <Alert severity="success">
                        {searchQuery ? 'Nicio cameră găsită pentru această căutare.' : `Nicio cameră nu are statusul "${viewStatus}".`}
                    </Alert>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Cameră</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Tip</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Preț/Noapte</TableCell>
                                    {canUpdate && <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Acțiuni</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRooms.map((room) => (
                                    <TableRow
                                        key={room.id}
                                        component={motion.tr}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 2,
                                                        background: `linear-gradient(135deg, ${getRoomTypeColor(room.type)} 0%, ${getRoomTypeColor(room.type)}dd 100%)`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        boxShadow: `0 4px 12px ${getRoomTypeColor(room.type)}40`,
                                                    }}
                                                >
                                                    <KingBedIcon sx={{ fontSize: 20 }} />
                                                </Box>
                                                <Typography variant="body1" fontWeight="bold">
                                                    {room.number}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
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
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={room.status === 'Necesită Curățenie' ? <CleaningServicesIcon /> : <CheckCircleIcon />}
                                                label={room.status}
                                                size="small"
                                                color={room.status === 'Necesită Curățenie' ? 'warning' : 'success'}
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold" color="#f59e0b">
                                                {room.price} RON
                                            </Typography>
                                        </TableCell>
                                        {canUpdate && (
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleUpdateStatus(room.id, room.status === 'Necesită Curățenie' ? 'Curat' : 'Necesită Curățenie')}
                                                    color={room.status === 'Necesită Curățenie' ? 'success' : 'warning'}
                                                    startIcon={room.status === 'Necesită Curățenie' ? <CheckIcon /> : <CloseIcon />}
                                                    sx={{
                                                        minWidth: '160px',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.75rem',
                                                    }}
                                                >
                                                    {room.status === 'Necesită Curățenie' ? 'Marchează Curat' : 'Marchează Murdar'}
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </motion.div>
    );
}

export default HousekeepingList;