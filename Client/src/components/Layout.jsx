import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    CssBaseline,
    Avatar,
    Chip,
    IconButton,
    Tooltip,
    useTheme,
    alpha,
} from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { motion } from 'framer-motion';
import SideMenu from './SideMenu';

const drawerWidth = 268;

const ROLE_LABELS = {
    ROLE_Admin: 'Administrator',
    ROLE_Manager: 'Manager',
    ROLE_Receptionist: 'Receptionist',
    ROLE_Cleaner: 'Housekeeping',
    ROLE_Chef: 'Chef',
};

function Layout() {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const handleLogout = () => {
        auth.logout();
        navigate('/login');
    };

    const getPageMeta = (path) => {
        if (path === '/' || path === '') return { title: 'Dashboard', subtitle: 'Privire de ansamblu' };
        if (path.startsWith('/reservations')) return { title: 'Rezervări', subtitle: 'Management rezervări' };
        if (path.startsWith('/employees')) return { title: 'Angajați', subtitle: 'Echipa hotelului' };
        if (path.startsWith('/guests')) return { title: 'Oaspeți', subtitle: 'Profilurile clienților' };
        if (path.startsWith('/rooms')) return { title: 'Camere', subtitle: 'Inventar și statusuri' };
        if (path.startsWith('/reports')) return { title: 'Rapoarte', subtitle: 'Analize financiare' };
        if (path.startsWith('/housekeeping-requests')) return { title: 'Cereri Curățenie', subtitle: 'Cereri active' };
        if (path.startsWith('/housekeeping')) return { title: 'Curățenie', subtitle: 'Programare housekeeping' };
        if (path.startsWith('/room-service')) return { title: 'Room Service', subtitle: 'Comenzi în desfășurare' };
        return { title: 'Hotel Admin', subtitle: '' };
    };

    const meta = getPageMeta(location.pathname);

    const getAvatarInitial = () => {
        if (!auth.user?.name) return '?';
        const parts = auth.user.name.trim().split(/\s+/);
        if (parts.length > 1) {
            return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
        }
        return parts[0].charAt(0).toUpperCase();
    };

    const roleLabel = ROLE_LABELS[auth.user?.role] || 'Utilizator';

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    zIndex: theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72, px: { xs: 2, md: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                color: '#fff',
                                boxShadow: `0 8px 24px -10px ${alpha(theme.palette.primary.main, 0.7)}`,
                                flexShrink: 0,
                            }}
                        >
                            <HomeOutlinedIcon fontSize="small" />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{ fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em' }}
                            >
                                {meta.title}
                            </Typography>
                            {meta.subtitle && (
                                <Typography
                                    variant="caption"
                                    noWrap
                                    sx={{ color: 'text.secondary', fontSize: 12 }}
                                >
                                    {meta.subtitle}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                gap: 1.5,
                                px: 1.5,
                                py: 0.75,
                                borderRadius: 999,
                                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.12 : 0.08),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                }}
                            >
                                {getAvatarInitial()}
                            </Avatar>
                            <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                                <Typography sx={{ fontSize: 13, fontWeight: 600 }} noWrap>
                                    {auth.user?.name || 'Utilizator'}
                                </Typography>
                                <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>
                                    {roleLabel}
                                </Typography>
                            </Box>
                        </Box>

                        <Chip
                            size="small"
                            label={roleLabel}
                            sx={{
                                display: { xs: 'inline-flex', md: 'none' },
                                fontWeight: 700,
                                bgcolor: alpha(theme.palette.primary.main, 0.15),
                                color: theme.palette.primary.main,
                            }}
                        />

                        <Tooltip title="Deconectare">
                            <IconButton
                                onClick={handleLogout}
                                sx={{
                                    display: { xs: 'inline-flex', sm: 'none' },
                                    color: 'text.primary',
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <LogoutOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Button
                            onClick={handleLogout}
                            startIcon={<LogoutOutlinedIcon />}
                            variant="outlined"
                            color="inherit"
                            sx={{
                                display: { xs: 'none', sm: 'inline-flex' },
                                borderColor: theme.palette.divider,
                                color: 'text.primary',
                                '&:hover': {
                                    borderColor: theme.palette.error.main,
                                    color: theme.palette.error.main,
                                    bgcolor: alpha(theme.palette.error.main, 0.06),
                                },
                            }}
                        >
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
                    p: { xs: 2, sm: 3, md: 4 },
                    width: `calc(100% - ${drawerWidth}px)`,
                    minHeight: '100vh',
                    overflowX: 'hidden',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'fixed',
                        inset: 0,
                        pointerEvents: 'none',
                        zIndex: -1,
                        backgroundImage: isDark
                            ? `radial-gradient(at 18% 6%, ${alpha(theme.palette.primary.main, 0.20)} 0, transparent 45%),
                               radial-gradient(at 88% 0%, ${alpha(theme.palette.secondary.main, 0.18)} 0, transparent 45%),
                               radial-gradient(at 50% 100%, ${alpha(theme.palette.secondary.main, 0.10)} 0, transparent 55%)`
                            : `radial-gradient(at 18% 6%, ${alpha(theme.palette.primary.main, 0.10)} 0, transparent 45%),
                               radial-gradient(at 88% 0%, ${alpha(theme.palette.secondary.main, 0.10)} 0, transparent 45%),
                               radial-gradient(at 50% 100%, ${alpha(theme.palette.secondary.main, 0.06)} 0, transparent 55%)`,
                    },
                }}
            >
                <Toolbar sx={{ minHeight: '72px !important' }} />
                <Box sx={{ pt: 1 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default Layout;
