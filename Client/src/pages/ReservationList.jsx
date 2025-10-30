import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Typography, Paper, Box, Chip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { motion } from 'framer-motion';

function ReservationList() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = useAuth();

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/reservations', {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                setReservations(response.data);
            } catch (error) {
                console.error('Eroare la preluarea rezervărilor:', error);
            } finally {
                setLoading(false);
            }
        };
        if (auth.token) fetchReservations();
    }, [auth.token]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 80, headerAlign: 'center', align: 'center' },
        { field: 'guestName', headerName: 'Nume Oaspete', flex: 1.5, minWidth: 180 },
        { field: 'roomNumber', headerName: 'Cameră', width: 100, headerAlign: 'center', align: 'center' },
        { 
            field: 'roomType', 
            headerName: 'Tip Cameră', 
            flex: 1, 
            minWidth: 120,
            renderCell: (params) => (
                <Chip label={params.value} size="small" variant="outlined" />
            )
        },
        { 
            field: 'startDate', 
            headerName: 'Check-in', 
            type: 'date',
            flex: 1, 
            minWidth: 120,
            valueGetter: (value) => value ? new Date(value) : null,
        },
        { 
            field: 'endDate', 
            headerName: 'Check-out', 
            type: 'date',
            flex: 1, 
            minWidth: 120,
            valueGetter: (value) => value ? new Date(value) : null,
        },
        { 
            field: 'totalPrice', 
            headerName: 'Preț Total', 
            type: 'number', 
            flex: 1, 
            minWidth: 130,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight={700} color="#f59e0b">
                    {params.value.toFixed(2)} RON
                </Typography>
            )
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Paper 
                sx={{ 
                    p: 3, 
                    height: '80vh', 
                    width: '100%',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
            >
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        🧾 Lista Rezervărilor
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Vezi toate rezervările curente și viitoare
                    </Typography>
                </Box>
                <Box sx={{ height: 'calc(100% - 80px)' }}>
                    <DataGrid
                        rows={reservations}
                        columns={columns}
                        loading={loading}
                        pageSizeOptions={[10, 25, 50]}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: { 
                                showQuickFilter: true, 
                                quickFilterProps: { debounceMs: 500 } 
                            },
                        }}
                        disableRowSelectionOnClick
                        sx={{ border: 0 }}
                    />
                </Box>
            </Paper>
        </motion.div>
    );
}

export default ReservationList;