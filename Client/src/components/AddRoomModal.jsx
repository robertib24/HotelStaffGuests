import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, MenuItem } from '@mui/material';

function AddRoomModal({ open, onClose, onSave, initialData }) {
    const [number, setNumber] = useState('');
    const [type, setType] = useState('Single');
    const [price, setPrice] = useState('');

    const isEditing = initialData != null;

    useEffect(() => {
        if (isEditing) {
            setNumber(initialData.number);
            setType(initialData.type);
            setPrice(initialData.price.toString());
        } else {
            clearForm();
        }
    }, [initialData, open, isEditing]);

    const clearForm = () => {
        setNumber('');
        setType('Single');
        setPrice('');
    };

    const handleSubmit = () => {
        const roomData = { 
            ...initialData, 
            number, 
            type, 
            price: parseFloat(price) 
        };
        onSave(roomData, isEditing);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ component: 'form' }} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                {isEditing ? 'Modifică Cameră' : 'Adaugă o Cameră Nouă'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        autoFocus
                        required
                        label="Număr Cameră"
                        fullWidth
                        variant="outlined"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                    />
                    <TextField
                        required
                        select
                        label="Tip Cameră"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="Single">Single</MenuItem>
                        <MenuItem value="Double">Double</MenuItem>
                        <MenuItem value="Suite">Suite</MenuItem>
                        <MenuItem value="Deluxe">Deluxe</MenuItem>
                        <MenuItem value="Presidential">Presidential</MenuItem>
                    </TextField>
                    <TextField
                        required
                        label="Preț / Noapte (RON)"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">Anulează</Button>
                <Button type="submit" variant="contained">Salvează Cameră</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddRoomModal;