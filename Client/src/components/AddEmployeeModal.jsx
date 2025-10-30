import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, MenuItem } from '@mui/material';

function AddEmployeeModal({ open, onClose, onSave }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Receptionist');

    const clearForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setRole('Receptionist');
    };

    const handleSubmit = () => {
        onSave({ name, email, password, role });
        onClose();
        clearForm();
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ component: 'form' }} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Adaugă Angajat Nou</DialogTitle>
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
                    <TextField
                        required
                        label="Parolă Inițială"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        required
                        select
                        label="Rol"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                        <MenuItem value="Receptionist">Receptionist</MenuItem>
                        <MenuItem value="Cleaner">Cleaner</MenuItem>
                        <MenuItem value="Chef">Chef</MenuItem>
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">Anulează</Button>
                <Button type="submit" variant="contained">Salvează Angajat</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddEmployeeModal;