import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Typography, Box, Button, TextField, MenuItem, Grid, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function ReservationModal({ open, onClose, onSave, initialData }) {
    const [guests, setGuests] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const auth = useAuth();

    const [selectedGuestId, setSelectedGuestId] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const isEditing = initialData != null;

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
                setError('Eroare la preluarea datelor.');
            } finally {
                setLoading(false);
            }
        };
        if (open && auth.token) {
            fetchData();
        }
    }, [open, auth.token]);

    useEffect(() => {
        if (open) {
            setError('');
            setSuccess('');
            if (isEditing) {
                setSelectedGuestId(initialData.guestId || '');
                setSelectedRoomId(initialData.roomId || '');
                setStartDate(initialData.startDate ? initialData.startDate.split('T')[0] : '');
                setEndDate(initialData.endDate ? initialData.endDate.split('T')[0] : '');
            } else {
                setSelectedGuestId('');
                setSelectedRoomId('');
                setStartDate('');
                setEndDate('');
            }
        }
    }, [initialData, open, isEditing]);

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

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        if (calculatedPrice <= 0) {
            setError('Datele introduse nu sunt valide. Verificați intervalul de date.');
            return;
        }

        const reservationData = {
            id: isEditing ? initialData.id : undefined,
            guestId: selectedGuestId,
            roomId: selectedRoomId,
            startDate,
            endDate
        };

        try {
            await onSave(reservationData, isEditing);
            setSuccess('Rezervarea a fost salvată cu succes!');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Eroare la salvarea rezervării.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ component: 'form' }} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} maxWidth="md">
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                {isEditing ? 'Modifică Rezervare' : 'Creare Rezervare Nouă'}
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ pt: 2, minWidth: { md: 600 } }}>
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
                                <Box sx={{ p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2, textAlign: 'center' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                        Total: {calculatedPrice.toFixed(2)} RON
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">Anulează</Button>
                <Button type="submit" variant="contained">Salvează Rezervarea</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ReservationModal;