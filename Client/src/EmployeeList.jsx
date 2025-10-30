import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import { Typography, Paper, Box, Button, Chip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { motion } from 'framer-motion';
import AddEmployeeModal from './components/AddEmployeeModal';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const auth = useAuth();

    const fetchEmployees = async () => {
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
    };

    useEffect(() => {
        if (auth.token) fetchEmployees();
    }, [auth.token]);
    
    const handleSaveEmployee = async (employeeData) => {
        try {
            await axios.post('http://localhost:8080/api/employees', employeeData, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            fetchEmployees();
        } catch (error) {
            console.error('Eroare la salvarea angajatului:', error);
        }
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                        }}
                    >
                        {params.value.charAt(0).toUpperCase()}
                    </Box>
                    <Typography variant="body2" fontWeight={500}>
                        {params.value}
                    </Typography>
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
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                👥 Echipa Angajaților
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Gestionează echipa ta cu ușurință
                            </Typography>
                        </Box>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />}
                                onClick={() => setModalOpen(true)}
                                sx={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                        boxShadow: '0 6px 25px rgba(59, 130, 246, 0.5)',
                                    }
                                }}
                            >
                                Adaugă Angajat
                            </Button>
                        </motion.div>
                    </Box>
                    <Box sx={{ height: 'calc(100% - 80px)' }}>
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
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                                    transition: 'background-color 0.2s',
                                },
                                '& .MuiDataGrid-columnHeader': {
                                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                                    fontWeight: 'bold',
                                }
                            }}
                        />
                    </Box>
                </Paper>
            </motion.div>
            <AddEmployeeModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveEmployee}
            />
        </>
    );
}

export default EmployeeList;