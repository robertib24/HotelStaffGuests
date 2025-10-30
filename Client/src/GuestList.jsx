import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import { Typography, Paper, Box, Button, Avatar } from '@mui/material';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import AddGuestModal from './components/AddGuestModal';

function GuestList() {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);
    const auth = useAuth();

    const fetchGuests = useCallback(async () => {
        setLoading(true);
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
    }, [auth.token]);

    useEffect(() => {
        if (auth.token) fetchGuests();
    }, [auth.token, fetchGuests]);

    const handleSaveGuest = async (guestData, isEditing) => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8080/api/guests/${guestData.id}`, guestData, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
            } else {
                await axios.post('http://localhost:8080/api/guests', guestData, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
            }
            fetchGuests();
        } catch (error) {
            console.error('Eroare la salvarea oaspetelui:', error);
        }
    };

    const handleEditClick = (id) => {
        const guestToEdit = guests.find((guest) => guest.id === id);
        setEditingGuest(guestToEdit);
        setModalOpen(true);
    };

    const handleDeleteClick = useCallback(async (id) => {
        if (window.confirm('Sunteți sigur că doriți să ștergeți acest oaspete?')) {
            try {
                await axios.delete(`http://localhost:8080/api/guests/${id}`, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                fetchGuests();
            } catch (error) {
                console.error('Eroare la ștergerea oaspetelui:', error);
            }
        }
    }, [auth.token, fetchGuests]);

    const handleOpenAddModal = () => {
        setEditingGuest(null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingGuest(null);
    };

    const columns = [
        { 
            field: 'id', 
            headerName: 'ID', 
            width: 80,
            headerAlign: 'center',
            align: 'center',
        },
        { 
            field: 'name', 
            headerName: 'Nume Oaspete', 
            flex: 1.5, 
            minWidth: 220,
            renderCell: (params) => (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                fontSize: '0.875rem',
                            }}
                        >
                            <PersonIcon />
                        </Avatar>
                        <Typography variant="body2" fontWeight={500}>
                            {params.value}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        { 
            field: 'email', 
            headerName: 'Email', 
            flex: 2, 
            minWidth: 280,
            renderCell: (params) => (
                <Typography variant="body2" color="text.secondary">
                    {params.value}
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
                        label="Șterge"
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
                        height: '75vh', 
                        width: '100%',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(5, 150, 105, 0.03) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                🌟 Lista Oaspeților
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Toți oaspeții hotelului tău
                            </Typography>
                        </Box>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />}
                                onClick={handleOpenAddModal}
                                sx={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                        boxShadow: '0 6px 25px rgba(16, 185, 129, 0.5)',
                                    }
                                }}
                            >
                                Adaugă Oaspete
                            </Button>
                        </motion.div>
                    </Box>
                    <Box sx={{ height: 'calc(100% - 80px)' }}>
                        <DataGrid
                            rows={guests}
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
                            sx={{ 
                                border: 0,
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                                    transition: 'background-color 0.2s',
                                },
                                '& .MuiDataGrid-columnHeader': {
                                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                                    fontWeight: 'bold',
                                }
                            }}
                        />
                    </Box>
                </Paper>
            </motion.div>
            <AddGuestModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveGuest}
                initialData={editingGuest}
            />
        </>
    );
}

export default GuestList;