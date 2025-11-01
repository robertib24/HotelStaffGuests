import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import { Typography, Paper, Box, Button, Chip } from '@mui/material';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { motion } from 'framer-motion';
import AddEmployeeModal from './components/AddEmployeeModal';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const auth = useAuth();

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/employees', {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            setEmployees(response.data);
        } catch (error) {
            console.error('Eroare la preluarea angajaților:', error);
        } finally {
            setLoading(false);
        }
    }, [auth.token]);

    useEffect(() => {
        if (auth.token) fetchEmployees();
    }, [auth.token, fetchEmployees]);
    
    const handleSaveEmployee = async (employeeData, isEditing) => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8080/api/employees/${employeeData.id}`, employeeData, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
            } else {
                await axios.post('http://localhost:8080/api/employees', employeeData, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
            }
            fetchEmployees();
        } catch (error) {
            console.error('Eroare la salvarea angajatului:', error);
        }
    };

    const handleEditClick = (id) => {
        const employeeToEdit = employees.find((emp) => emp.id === id);
        setEditingEmployee(employeeToEdit);
        setModalOpen(true);
    };

    const handleDeleteClick = useCallback(async (id) => {
        if (window.confirm('Sunteți sigur că doriți să ștergeți acest angajat?')) {
            try {
                await axios.delete(`http://localhost:8080/api/employees/${id}`, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                fetchEmployees();
            } catch (error) {
                console.error('Eroare la ștergerea angajatului:', error);
            }
        }
    }, [auth.token, fetchEmployees]);

    const handleOpenAddModal = () => {
        setEditingEmployee(null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingEmployee(null);
    };

    const getRoleColor = (role) => {
        const colors = {
            'Admin': '#3b82f6',
            'Manager': '#8b5cf6',
            'Receptionist': '#10b981',
            'Cleaner': '#f59e0b',
            'Chef': '#ef4444'
        };
        return colors[role] || '#6b7280';
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
            headerName: 'Nume', 
            flex: 1.5, 
            minWidth: 180,
            renderCell: (params) => (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${getRoleColor(params.row.role)} 0%, ${getRoleColor(params.row.role)}dd 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                flexShrink: 0,
                                boxShadow: `0 4px 12px ${getRoleColor(params.row.role)}40`,
                            }}
                        >
                            {params.value.charAt(0).toUpperCase()}
                        </Box>
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
            minWidth: 220 
        },
        { 
            field: 'role', 
            headerName: 'Rol', 
            flex: 1, 
            minWidth: 140,
            renderCell: (params) => (
                <Chip 
                    label={params.value}
                    sx={{
                        background: `${getRoleColor(params.value)}20`,
                        color: getRoleColor(params.value),
                        fontWeight: 'bold',
                        border: `1px solid ${getRoleColor(params.value)}40`,
                    }}
                />
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>👥</span> Echipa Angajaților
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Gestionează echipa ta cu ușurință
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
                                Adaugă Angajat
                            </Button>
                        </motion.div>
                    </Box>
                    <Box sx={{ height: 'calc(100% - 100px)' }}>
                        <DataGrid
                            rows={employees}
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
                </Paper>
            </motion.div>
            <AddEmployeeModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveEmployee}
                initialData={editingEmployee}
            />
        </>
    );
}

export default EmployeeList;