import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from '@mui/material';

function AddGuestModal({ open, onClose, onSave, initialData }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const isEditing = initialData != null;

    useEffect(() => {
        if (isEditing) {
            setName(initialData.name);
            setEmail(initialData.email);
        } else {
            setName('');
            setEmail('');
        }
    }, [initialData, open, isEditing]);

    const handleSubmit = () => {
        const guestData = { ...initialData, name, email };
        onSave(guestData, isEditing);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ component: 'form' }} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                {isEditing ? 'Modifică Oaspete' : 'Adaugă Oaspete Nou'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        autoFocus
                        required
                        label="Nume Complet"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        required
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">Anulează</Button>
                <Button type="submit" variant="contained">Salvează Oaspete</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddGuestModal;