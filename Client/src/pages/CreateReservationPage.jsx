import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Typography, Paper, Box, Button, TextField, MenuItem, Grid, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function CreateReservationPage() {
    const [guests, setGuests] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();

    const [selectedGuestId, setSelectedGuestId] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [guestsRes, roomsRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/guests', {
                        headers: { 'Authorization': `Bearer ${auth.token}` }
                    }),
                    axios.get('http://localhost:8080/api/rooms', {
                        headers: { 'Authorization': `Bearer ${auth.token}` }
                    })
                ]);
                setGuests(guestsRes.data);
                setRooms(roomsRes.data);
            } catch (err) {
                setError('Eroare la preluarea datelor. Reîncercați.');
            } finally {
                setLoading(false);
            }
        };
        if (auth.token) fetchData();
    }, [auth.token]);

    const calculatedPrice = useMemo(() => {
        if (!selectedRoomId || !startDate || !endDate) return 0;
        
        const room = rooms.find(r => r.id === selectedRoomId);
        if (!room) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end <= start) return 0;

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        return diffDays * room.price;
    }, [selectedRoomId, startDate, endDate, rooms]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (calculatedPrice <= 0) {
            setError('Datele introduse nu sunt valide. Verificați intervalul de date.');
            return;
        }

        const reservationData = {
            guestId: selectedGuestId,
            roomId: selectedRoomId,
            startDate,
            endDate
        };

        try {
            await axios.post('http://localhost:8080/api/reservations', reservationData, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            setSuccess('Rezervarea a fost creată cu succes!');
            setSelectedGuestId('');
            setSelectedRoomId('');
            setStartDate('');
            setEndDate('');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Eroare la crearea rezervării.');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Paper 
                component="form"
                onSubmit={handleSubmit}
                sx={{ 
                    p: 4, 
                    width: '100%',
                    maxWidth: '800px',
                    mx: 'auto',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
                    📅 Creare Rezervare Nouă
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            select
                            required
                            fullWidth
                            label="Selectează Oaspetele"
                            value={selectedGuestId}
                            onChange={(e) => setSelectedGuestId(e.target.value)}
                        >
                            <MenuItem value="" disabled><em>Niciunul</em></MenuItem>
                            {guests.map((guest) => (
                                <MenuItem key={guest.id} value={guest.id}>
                                    {guest.name} ({guest.email})
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            required
                            fullWidth
                            label="Selectează Camera"
                            value={selectedRoomId}
                            onChange={(e) => setSelectedRoomId(e.target.value)}
                        >
                            <MenuItem value="" disabled><em>Niciuna</em></MenuItem>
                            {rooms.map((room) => (
                                <MenuItem key={room.id} value={room.id}>
                                    Nr. {room.number} - {room.type} ({room.price} RON/noapte)
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            type="date"
                            label="Dată Început (Check-in)"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            type="date"
                            label="Dată Sfârșit (Check-out)"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ p: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                Total: {calculatedPrice.toFixed(2)} RON
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                py: 1.5,
                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                            }}
                        >
                            Salvează Rezervarea
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </motion.div>
    );
}

export default CreateReservationPage;