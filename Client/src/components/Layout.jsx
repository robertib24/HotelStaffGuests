import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline, Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SideMenu from './SideMenu';

const drawerWidth = 260;

function Layout() {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        auth.logout();
        navigate('/login');
    };

    const getPageTitle = (path) => {
        switch (path) {
            case '/reservations/new': return 'Creare Rezervare Nouă';
            case '/reservations': return 'Management Rezervări';
            case '/employees': return 'Management Angajați';
            case '/guests': return 'Management Oaspeți';
            case '/rooms': return 'Management Camere';
            case '/reports': return 'Rapoarte Financiare';
            default: return 'Dashboard General';
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h5" noWrap component="div">
                        {getPageTitle(location.pathname)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1">Admin Manager</Typography>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>A</Avatar>
                        <Button variant="outlined" color="inherit" onClick={handleLogout}>
                            Deconectare
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            
            <SideMenu />
            
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    width: `calc(100% - ${drawerWidth}px)`,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Box>
    );
}

export default Layout;