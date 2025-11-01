import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, MenuItem, Typography } from '@mui/material';

function AddEmployeeModal({ open, onClose, onSave, initialData }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Receptionist');

    const isEditing = initialData != null;

    useEffect(() => {
        if (isEditing) {
            setName(initialData.name);
            setEmail(initialData.email);
            setRole(initialData.role);
            setPassword('');
        } else {
            clearForm();
        }
    }, [initialData, open, isEditing]);

    const clearForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setRole('Receptionist');
    };

    const handleSubmit = () => {
        const employeeData = { 
            id: initialData?.id,
            name, 
            email, 
            role,
            ...(password && { password })
        };
        onSave(employeeData, isEditing);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ component: 'form' }} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                {isEditing ? 'Modifică Angajat' : 'Adaugă Angajat Nou'}
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
                    <TextField
                        required={!isEditing}
                        label="Parolă"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        helperText={isEditing ? "Lasă gol pentru a păstra parola actuală" : "Parolă inițială"}
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