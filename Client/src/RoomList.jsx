import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import { Typography, Paper, Box, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = useAuth();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/rooms', {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                setRooms(response.data);
            } catch (error) {
                console.error('Eroare la preluarea camerelor:', error);
            } finally {
                setLoading(false);
            }
        };
        if (auth.token) fetchRooms();
    }, [auth.token]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'number', headerName: 'Număr Cameră', flex: 1, minWidth: 150 },
        { field: 'type', headerName: 'Tip Cameră', flex: 1, minWidth: 150 },
        { 
            field: 'price', 
            headerName: 'Preț (RON)', 
            type: 'number', 
            flex: 1, 
            minWidth: 120 
        },
    ];

    return (
        <Paper sx={{ p: 2, height: '75vh', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Tabel Camere
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />}>
                    Adaugă Cameră
                </Button>
            </Box>
            <Box sx={{ height: 'calc(100% - 64px)' }}>
                <DataGrid
                    rows={rooms}
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

export default RoomList;