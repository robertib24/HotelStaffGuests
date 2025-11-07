import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { Typography, Paper, Box, Chip, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewListIcon from '@mui/icons-material/ViewList';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ReservationModal from '../components/ReservationModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { TableSkeleton, ChartSkeleton } from '../components/LoadingSkeletons';
import ReservationCalendar from '../components/ReservationCalendar';

function ReservationList() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [viewMode, setViewMode] = useState('calendar');
    const auth = useAuth();
    const { showToast } = useToast();
    const canManage = auth.user?.role === 'ROLE_Admin' || auth.user?.role === 'ROLE_Manager' || auth.user?.role === 'ROLE_Receptionist';

    const fetchReservations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/reservations', {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            setReservations(response.data);
        } catch (error) {
            console.error('Eroare la preluarea rezervărilor:', error);
            showToast('Eroare la preluarea rezervărilor', 'error');
        } finally {
            setLoading(false);
        }
    }, [auth.token, showToast]);

    useEffect(() => {
        if (auth.token) fetchReservations();
    }, [auth.token, fetchReservations]);

    const handleSaveReservation = async (reservationData, isEditing) => {
        try {
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
            showToast(isEditing ? 'Rezervare modificată!' : 'Rezervare adăugată!', 'success');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Eroare la salvarea rezervării';
            showToast(errorMsg, 'error');
            console.error('Eroare la salvarea rezervării:', error);
            throw error;
        }
    };

    const handleEditClick = useCallback((id) => {
        const reservationToEdit = reservations.find((r) => r.id === id);
        if (reservationToEdit) {
            setEditingReservation({
                id: reservationToEdit.id,
                guestId: reservationToEdit.guestId,
                roomId: reservationToEdit.roomId,
                startDate: reservationToEdit.startDate,
                endDate: reservationToEdit.endDate,
            });
            setModalOpen(true);
        } else {
            console.error("Nu s-au putut găsi datele pentru editare. Verifică DTO-ul de pe backend.");
            showToast("Eroare la deschiderea editării", "error");
        }
    }, [reservations, showToast]);

    const handleDeleteClick = useCallback((id) => {
        setRowToDelete(id);
        setConfirmOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!rowToDelete) return;
        try {
            await axios.delete(`http://localhost:8080/api/reservations/${rowToDelete}`, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            fetchReservations();
            showToast('Rezervare anulată!', 'success');
        } catch (error) {
            console.error('Eroare la anularea rezervării:', error);
            showToast('Eroare la anularea rezervării', 'error');
        } finally {
            setConfirmOpen(false);
            setRowToDelete(null);
        }
    }, [auth.token, fetchReservations, rowToDelete, showToast]);

    const handleOpenAddModal = () => {
        setEditingReservation(null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingReservation(null);
    };

    const exportToCSV = () => {
        const headers = ['Cod Rezervare', 'Nume Oaspete', 'Cameră', 'Tip Cameră', 'Check-in', 'Check-out', 'Preț Total'];
        let csvContent = headers.join(',') + '\n';
        
        reservations.forEach(r => {
            const row = [r.reservationCode, r.guestName, r.roomNumber, r.roomType, r.startDate, r.endDate, r.totalPrice];
            csvContent += row.map(val => `"${val}"`).join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'rezervari.csv');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToExcel = () => {
        const headers = ['Cod Rezervare', 'Nume Oaspete', 'Cameră', 'Tip Cameră', 'Check-in', 'Check-out', 'Preț Total'];
        let tableHTML = '<table><thead><tr>';
        
        headers.forEach(header => {
            tableHTML += `<th>${header}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';
        
        reservations.forEach(r => {
            tableHTML += '<tr>';
            tableHTML += `<td>${r.reservationCode}</td>`;
            tableHTML += `<td>${r.guestName}</td>`;
            tableHTML += `<td>${r.roomNumber}</td>`;
            tableHTML += `<td>${r.roomType}</td>`;
            tableHTML += `<td>${r.startDate}</td>`;
            tableHTML += `<td>${r.endDate}</td>`;
            tableHTML += `<td>${r.totalPrice}</td>`;
            tableHTML += '</tr>';
        });
        tableHTML += '</tbody></table>';

        const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'rezervari.xlsx');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const columns = useMemo(() => {
        const baseColumns = [
            { 
                field: 'reservationCode', 
                headerName: 'Cod Rezervare', 
                width: 180,
                headerAlign: 'center',
                align: 'center',
                renderCell: (params) => (
                    <Box sx={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}>
                        <Chip 
                            icon={<ConfirmationNumberIcon sx={{ fontSize: '0.875rem' }} />}
                            label={params.value}
                            size="small"
                            sx={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontFamily: 'monospace',
                                fontSize: '0.75rem',
                                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                            }}
                        />
                    </Box>
                )
            },
            { 
                field: 'guestName', 
                headerName: 'Nume Oaspete', 
                flex: 1.5, 
                minWidth: 180, 
                headerAlign: 'left', 
                align: 'left' 
            },
            { field: 'roomNumber', headerName: 'Cameră', width: 100, headerAlign: 'center', align: 'center' },
            { 
                field: 'roomType', 
                headerName: 'Tip Cameră', 
                flex: 1, 
                minWidth: 120,
                headerAlign: 'left',
                align: 'left',
                renderCell: (params) => (
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Chip label={params.value} size="small" variant="outlined" />
                    </Box>
                )
            },
            { 
                field: 'startDate', 
                headerName: 'Check-in', 
                type: 'date',
                flex: 1, 
                minWidth: 120,
                headerAlign: 'left',
                align: 'left',
                valueGetter: (value) => value ? new Date(value) : null,
            },
            { 
                field: 'endDate', 
                headerName: 'Check-out', 
                type: 'date',
                flex: 1, 
                minWidth: 120,
                headerAlign: 'left',
                align: 'left',
                valueGetter: (value) => value ? new Date(value) : null,
            },
            { 
                field: 'totalPrice', 
                headerName: 'Preț Total', 
                type: 'number', 
                flex: 1, 
                minWidth: 130,
                headerAlign: 'left',
                align: 'left',
                renderCell: (params) => (
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Typography variant="body2" fontWeight={700} color="#f59e0b">
                            {params.value.toFixed(2)} RON
                        </Typography>
                    </Box>
                )
            },
        ];

        if (canManage) {
            baseColumns.push({
                field: 'actions',
                type: 'actions',
                headerName: 'Acțiuni',
                width: 100,
                headerAlign: 'center',
                align: 'center',
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
            });
        }

        return baseColumns;
    }, [canManage, handleEditClick, handleDeleteClick]);

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
                        minHeight: '80vh', 
                        width: '100%',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(139, 92, 246, 0.06) 100%)',
                        border: '1.5px solid rgba(59, 130, 246, 0.25)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>🧾</span> Management Rezervări
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Vezi toate rezervările curente și viitoare
                                </Typography>
                            </Box>
                        </motion.div>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                             <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                                size="small"
                            >
                                <ToggleButton value="list">
                                    <ViewListIcon sx={{ mr: 1 }} /> Listă
                                </ToggleButton>
                                <ToggleButton value="calendar">
                                    <CalendarMonthIcon sx={{ mr: 1 }} /> Calendar
                                </ToggleButton>
                            </ToggleButtonGroup>
                            {canManage && (
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
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                            boxShadow: '0 6px 24px rgba(59, 130, 246, 0.5)',
                                            px: 3,
                                            py: 1.25,
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.6)',
                                                transform: 'translateY(-2px)',
                                            }
                                        }}
                                    >
                                        Adaugă
                                    </Button>
                                </motion.div>
                            )}
                        </Box>
                    </Box>

                    {viewMode === 'list' && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Button 
                                onClick={exportToCSV} 
                                variant="outlined" 
                                size="small" 
                                startIcon={<UploadFileIcon />}
                            >
                                Export CSV
                            </Button>
                            <Button 
                                onClick={exportToExcel} 
                                variant="outlined" 
                                size="small" 
                                startIcon={<UploadFileIcon />}
                            >
                                Export Excel
                            </Button>
                        </Box>
                    )}
                    
                    {loading ? (
                        viewMode === 'list' ? <TableSkeleton rows={10} /> : <ChartSkeleton />
                    ) : viewMode === 'list' ? (
                        <Box sx={{ height: 'calc(100% - 160px)' }}>
                            <DataGrid
                                rows={reservations}
                                columns={columns}
                                loading={loading}
                                pageSizeOptions={[10, 25, 50, 100]}
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
                                        backgroundColor: 'rgba(59, 130, 246, 0.12)',
                                        transform: 'scale(1.005)',
                                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        backgroundColor: 'rgba(59, 130, 246, 0.08)',
                                        fontWeight: 'bold',
                                        fontSize: '0.95rem',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: '1px solid rgba(59, 130, 246, 0.08)',
                                    }
                                }}
                            />
                        </Box>
                    ) : (
                        <ReservationCalendar 
                            reservations={reservations} 
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                        />
                    )}
                </Paper>
            </motion.div>

            <ReservationModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveReservation}
                initialData={editingReservation}
            />

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Anulează Rezervarea"
                message="Ești sigur că dorești să anulezi această rezervare?"
                confirmText="Confirmă Anularea"
                severity="error"
            />
        </>
    );
}

export default ReservationList;