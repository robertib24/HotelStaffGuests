import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import { Typography, Paper, Box, Button, Chip } from '@mui/material';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { motion } from 'framer-motion';
import KingBedIcon from '@mui/icons-material/KingBed';
import AddRoomModal from './components/AddRoomModal';

function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const auth = useAuth();

    const fetchRooms = useCallback(async () => {
        setLoading(true);
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
    }, [auth.token]);

    useEffect(() => {
        if (auth.token) fetchRooms();
    }, [auth.token, fetchRooms]);

    const handleSaveRoom = async (roomData, isEditing) => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8080/api/rooms/${roomData.id}`, roomData, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
            } else {
                await axios.post('http://localhost:8080/api/rooms', roomData, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
            }
            fetchRooms();
        } catch (error) {
            console.error('Eroare la salvarea camerei:', error);
        }
    };

    const handleEditClick = (id) => {
        const roomToEdit = rooms.find((room) => room.id === id);
        setEditingRoom(roomToEdit);
        setModalOpen(true);
    };

    const handleDeleteClick = useCallback(async (id) => {
        if (window.confirm('Sunteți sigur că doriți să ștergeți această cameră?')) {
            try {
                await axios.delete(`http://localhost:8080/api/rooms/${id}`, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                fetchRooms();
            } catch (error) {
                console.error('Eroare la ștergerea camerei:', error);
            }
        }
    }, [auth.token, fetchRooms]);

    const handleOpenAddModal = () => {
        setEditingRoom(null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingRoom(null);
    };

    const getRoomTypeColor = (type) => {
        const colors = {
            'Single': '#3b82f6',
            'Double': '#8b5cf6',
            'Suite': '#f59e0b',
            'Deluxe': '#ef4444',
            'Presidential': '#ec4899'
        };
        return colors[type] || '#6b7280';
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 80, headerAlign: 'center', align: 'center' },
        { 
            field: 'number', 
            headerName: 'Număr Cameră', 
            flex: 1, 
            minWidth: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1,
                            background: `linear-gradient(135deg, ${getRoomTypeColor(params.row.type)} 0%, ${getRoomTypeColor(params.row.type)}dd 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            boxShadow: `0 4px 12px ${getRoomTypeColor(params.row.type)}40`,
                        }}
                    >
                        <KingBedIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography variant="body2" fontWeight={600}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        { 
            field: 'type', 
            headerName: 'Tip Cameră', 
            flex: 1, 
            minWidth: 150,
            renderCell: (params) => (
                <Chip 
                    label={params.value}
                    sx={{
                        background: `${getRoomTypeColor(params.value)}20`,
                        color: getRoomTypeColor(params.value),
                        fontWeight: 'bold',
                        border: `1px solid ${getRoomTypeColor(params.value)}40`,
                    }}
                />
            )
        },
        { 
            field: 'price', 
            headerName: 'Preț / Noapte', 
            type: 'number', 
            flex: 1, 
            minWidth: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" fontWeight={700} color="#f59e0b">
                        {params.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        RON
                    </Typography>
                </Box>
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
            >
                <Paper 
                    sx={{ 
                        p: 4, 
                        height: '80vh', 
                        width: '100%',
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(217, 119, 6, 0.06) 100%)',
                        border: '1.5px solid rgba(245, 158, 11, 0.25)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>🛏️</span> Camerele Hotelului
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Administrează toate camerele disponibile
                                </Typography>
                            </Box>
                        </motion.div>
                        <motion.div 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />}
                                onClick={handleOpenAddModal}
                                sx={{
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    boxShadow: '0 6px 24px rgba(245, 158, 11, 0.5)',
                                    px: 3,
                                    py: 1.25,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                                        boxShadow: '0 8px 32px rgba(245, 158, 11, 0.6)',
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                            >
                                Adaugă Cameră
                            </Button>
                        </motion.div>
                    </Box>
                    <Box sx={{ height: 'calc(100% - 100px)' }}>
                        <DataGrid
                            rows={rooms}
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
                                '& .MuiDataGrid-row': {
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                },
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                                    transform: 'scale(1.005)',
                                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                                },
                                '& .MuiDataGrid-columnHeader': {
                                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                                    fontWeight: 'bold',
                                    fontSize: '0.95rem',
                                },
                                '& .MuiDataGrid-cell': {
                                    borderBottom: '1px solid rgba(245, 158, 11, 0.08)',
                                }
                            }}
                        />
                    </Box>
                </Paper>
            </motion.div>

            <AddRoomModal 
                open={modalOpen} 
                onClose={handleCloseModal} 
                onSave={handleSaveRoom} 
                initialData={editingRoom}
            />
        </>
    );
}

export default RoomList;