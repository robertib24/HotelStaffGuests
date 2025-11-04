import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline, Avatar } from '@mui/material';
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
        if (path.startsWith('/reservations')) return 'Management Rezervări';
        if (path.startsWith('/employees')) return 'Management Angajați';
        if (path.startsWith('/guests')) return 'Management Oaspeți';
        if (path.startsWith('/rooms')) return 'Management Camere';
        if (path.startsWith('/reports')) return 'Rapoarte Financiare';
        if (path.startsWith('/housekeeping')) return 'Management Curățenie';
        return 'Dashboard General';
    };

    const getAvatarInitial = () => {
        if (!auth.user?.name) return '?';
        const parts = auth.user.name.split(' ');
        if (parts.length > 1) {
            return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
        }
        return parts[0].charAt(0).toUpperCase();
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
                        <Typography variant="body1">{auth.user?.name || 'Utilizator'}</Typography>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                            {getAvatarInitial()}
                        </Avatar>
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
                
                <Outlet />
                
            </Box>
        </Box>
    );
}

export default Layout;