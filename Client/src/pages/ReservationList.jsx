import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Typography, Paper, Box, Chip, Button } from '@mui/material';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ReservationModal from '../components/ReservationModal';

function ReservationList() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);
    const auth = useAuth();

    const fetchReservations = useCallback(async () => {
        setLoading(true);
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
    }, [auth.token]);

    useEffect(() => {
        if (auth.token) fetchReservations();
    }, [auth.token, fetchReservations]);

    const handleSaveReservation = async (reservationData, isEditing) => {
        if (isEditing) {
            await axios.put(`http://localhost:8080/api/reservations/${reservationData.id}`, reservationData, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
        } else {
            await axios.post('http://localhost:8080/api/reservations', reservationData, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
        }
        fetchReservations();
    };

    const handleEditClick = (id) => {
        const reservationToEdit = reservations.find((r) => r.id === id);
        setEditingReservation({
            ...reservationToEdit,
            guestId: reservations.find(r => r.id === id).guestId,
            roomId: reservations.find(r => r.id === id).roomId,
        });
        setModalOpen(true);
    };

    const handleDeleteClick = useCallback(async (id) => {
        if (window.confirm('Sunteți sigur că doriți să anulați această rezervare?')) {
            try {
                await axios.delete(`http://localhost:8080/api/reservations/${id}`, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                fetchReservations();
            } catch (error) {
                console.error('Eroare la anularea rezervării:', error);
            }
        }
    }, [auth.token, fetchReservations]);

    const handleOpenAddModal = () => {
        setEditingReservation(null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingReservation(null);
    };
    
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
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acțiuni',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Modifică"
                        onClick={() => handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Anulează"
                        onClick={() => handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                🧾 Lista Rezervărilor
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Vezi toate rezervările curente și viitoare
                            </Typography>
                        </Box>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />}
                                onClick={handleOpenAddModal}
                                sx={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                    }
                                }}
                            >
                                Adaugă Rezervare
                            </Button>
                        </motion.div>
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

            <ReservationModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveReservation}
                initialData={editingReservation}
            />
        </>
    );
}

export default ReservationList;