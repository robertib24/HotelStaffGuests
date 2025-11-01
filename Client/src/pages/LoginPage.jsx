import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, Alert, Paper } from '@mui/material';
import HotelIcon from '@mui/icons-material/NightShelter';
import { motion } from 'framer-motion';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

function LoginPage() {
    const [email, setEmail] = useState('admin@hotel.com');
    const [password, setPassword] = useState('1234');
    const [error, setError] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await auth.login(email, password);
        if (success) {
            navigate('/');
        } else {
            setError('Email sau parolă incorectă.');
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: { xs: 'column', md: 'row' } }}>
            
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'gradientFlow 8s ease infinite',
                    color: 'white',
                    p: { xs: 4, md: 8 },
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    '@keyframes gradientFlow': {
                        '0%, 100%': { backgroundPosition: '0% 50%' },
                        '50%': { backgroundPosition: '100% 50%' }
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        animation: 'float 6s ease-in-out infinite',
                    },
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0)' },
                        '50%': { transform: 'translateY(-20px)' }
                    }
                }}
            >
                <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 12 }}
                >
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(20px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            boxShadow: '0 12px 48px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.1)',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        <motion.div
                            animate={{ 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.05, 1, 1]
                            }}
                            transition={{ 
                                duration: 4, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <HotelIcon sx={{ fontSize: 64, color: 'white', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
                        </motion.div>
                    </Box>
                </motion.div>
                
                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                    <Typography component="h1" variant="h3" sx={{ fontWeight: 'bold', mb: 2, textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                        Hotel Admin
                    </Typography>
                </motion.div>
                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                    <Typography variant="h6" sx={{ fontWeight: 300, textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                        Gestionează-ți hotelul. Eficient și modern.
                    </Typography>
                </motion.div>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    py: 8,
                    px: 2
                }}
            >
                <Paper 
                    component={motion.div}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
                    elevation={24}
                    sx={{
                        width: '100%',
                        maxWidth: '500px',
                        p: { xs: 3, sm: 5 },
                        borderRadius: 5,
                        bgcolor: 'background.paper',
                        border: '1.5px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.5 }}
                    >
                        <Typography component="h2" variant="h4" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Autentificare
                        </Typography>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.6 }}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                            Bine ai revenit! Introdu detaliile contului tău.
                        </Typography>
                    </motion.div>

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            </motion.div>
                        )}
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.7 }}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Adresă Email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <EmailOutlinedIcon sx={{ color: 'action.active', mr: 1.5, fontSize: '20px' }} />
                                    ),
                                }}
                            />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.8 }}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Parolă"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <LockOutlinedIcon sx={{ color: 'action.active', mr: 1.5, fontSize: '20px' }} />
                                    ),
                                }}
                            />
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.9 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        py: 1.5,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                            boxShadow: '0 6px 25px rgba(102, 126, 234, 0.5)',
                                        },
                                    }}
                                >
                                    Intră în cont
                                </Button>
                            </motion.div>
                        </motion.div>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default LoginPage;