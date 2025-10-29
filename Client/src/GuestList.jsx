import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import { Typography, Paper, Box, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

function GuestList() {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = useAuth();

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/guests', {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                setGuests(response.data);
            } catch (error) {
                console.error('Eroare la preluarea oaspeților:', error);
            } finally {
                setLoading(false);
            }
        };
        if (auth.token) fetchGuests();
    }, [auth.token]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Nume Oaspete', flex: 1.5, minWidth: 200 },
        { field: 'email', headerName: 'Email', flex: 2, minWidth: 250 },
    ];

    return (
        <Paper sx={{ p: 2, height: '75vh', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Tabel Oaspeți
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />}>
                    Adaugă Oaspete
                </Button>
            </Box>
            <Box sx={{ height: 'calc(100% - 64px)' }}>
                <DataGrid
                    rows={guests}
                    columns={columns}
                    loading={loading}
                    pageSizeOptions={[10, 25, 50]}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } },
                    }}
                    disableRowSelectionOnClick
                    sx={{ border: 0 }}
                />
            </Box>
        </Paper>
    );
}

export default GuestList;