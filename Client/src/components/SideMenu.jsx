import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    Typography,
    Divider,
    Avatar,
    Chip,
    useTheme,
    alpha,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import KingBedIcon from '@mui/icons-material/KingBedOutlined';
import BadgeIcon from '@mui/icons-material/BadgeOutlined';
import HomeIcon from '@mui/icons-material/DashboardOutlined';
import HotelIcon from '@mui/icons-material/NightShelter';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import ListAltIcon from '@mui/icons-material/ListAltOutlined';
import CleaningServicesIcon from '@mui/icons-material/CleaningServicesOutlined';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import BuildIcon from '@mui/icons-material/Build';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 268;

const ROLE_LABELS = {
    ROLE_Admin: 'Administrator',
    ROLE_Manager: 'Manager',
    ROLE_Receptionist: 'Receptionist',
    ROLE_Cleaner: 'Housekeeping',
    ROLE_Chef: 'Chef',
};

const sections = [
    {
        title: 'Principal',
        items: [
            { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
        ],
    },
    {
        title: 'Operațional',
        items: [
            { text: 'Rezervări', icon: <ListAltIcon />, path: '/reservations', roles: ['ROLE_Admin', 'ROLE_Manager', 'ROLE_Receptionist'] },
            { text: 'Oaspeți', icon: <PeopleIcon />, path: '/guests', roles: ['ROLE_Admin', 'ROLE_Manager', 'ROLE_Receptionist'] },
            { text: 'Camere', icon: <KingBedIcon />, path: '/rooms', roles: ['ROLE_Admin', 'ROLE_Manager', 'ROLE_Receptionist', 'ROLE_Cleaner'] },
        ],
    },
    {
        title: 'Servicii',
        items: [
            { text: 'Curățenie', icon: <CleaningServicesIcon />, path: '/housekeeping', roles: ['ROLE_Admin', 'ROLE_Manager', 'ROLE_Cleaner'] },
            { text: 'Cereri Curățenie', icon: <BuildIcon />, path: '/housekeeping-requests', roles: ['ROLE_Admin', 'ROLE_Manager', 'ROLE_Cleaner'] },
            { text: 'Room Service', icon: <RoomServiceIcon />, path: '/room-service', roles: ['ROLE_Admin', 'ROLE_Manager', 'ROLE_Chef'] },
        ],
    },
    {
        title: 'Administrare',
        items: [
            { text: 'Angajați', icon: <BadgeIcon />, path: '/employees', roles: ['ROLE_Admin'] },
            { text: 'Rapoarte', icon: <AssessmentIcon />, path: '/reports', roles: ['ROLE_Admin'] },
        ],
    },
];

function isActive(currentPath, itemPath) {
    if (itemPath === '/') return currentPath === '/' || currentPath === '';
    return currentPath === itemPath || currentPath.startsWith(itemPath + '/');
}

function getInitial(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
        return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
}

function SideMenu() {
    const location = useLocation();
    const { user } = useAuth();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const visibleSections = sections
        .map(section => ({
            ...section,
            items: section.items.filter(item => !item.roles || item.roles.includes(user?.role)),
        }))
        .filter(section => section.items.length > 0);

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar
                sx={{
                    minHeight: '72px !important',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <motion.div whileHover={{ rotate: 12, scale: 1.05 }} transition={{ type: 'spring', stiffness: 250 }}>
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            boxShadow: `0 10px 24px -8px ${alpha(theme.palette.primary.main, 0.7)}`,
                        }}
                    >
                        <HotelIcon sx={{ color: '#fff', fontSize: 24 }} />
                    </Box>
                </motion.div>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: 17, lineHeight: 1.1 }}>
                        Hotel Admin
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
                        Management Suite
                    </Typography>
                </Box>
            </Toolbar>

            <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, px: 1.5, py: 2 }}>
                {visibleSections.map((section, sIdx) => (
                    <Box key={section.title} sx={{ mb: 2 }}>
                        <Typography
                            sx={{
                                px: 1.5,
                                mb: 0.75,
                                fontSize: 10.5,
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: 'text.secondary',
                                opacity: 0.75,
                            }}
                        >
                            {section.title}
                        </Typography>
                        <List disablePadding>
                            {section.items.map((item, idx) => {
                                const active = isActive(location.pathname, item.path);
                                return (
                                    <motion.div
                                        key={item.text}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.04 * (sIdx * 4 + idx) }}
                                    >
                                        <ListItem disablePadding sx={{ mb: 0.5 }}>
                                            <ListItemButton
                                                component={Link}
                                                to={item.path}
                                                selected={active}
                                                sx={{
                                                    borderRadius: 2.5,
                                                    py: 1.1,
                                                    pl: 1.75,
                                                    pr: 1.5,
                                                    transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                                                    color: active ? '#fff' : 'text.primary',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    '&.Mui-selected': {
                                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                                        boxShadow: `0 8px 24px -10px ${alpha(theme.palette.primary.main, 0.7)}`,
                                                        '& .MuiListItemIcon-root': { color: '#fff' },
                                                        '&:hover': {
                                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                                            filter: 'brightness(1.05)',
                                                        },
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.10 : 0.06),
                                                        transform: 'translateX(2px)',
                                                    },
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{
                                                        color: active ? '#fff' : 'text.secondary',
                                                        minWidth: 36,
                                                        transition: 'color 0.2s ease',
                                                    }}
                                                >
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.text}
                                                    primaryTypographyProps={{
                                                        fontWeight: active ? 700 : 500,
                                                        fontSize: 14,
                                                    }}
                                                />
                                                {active && (
                                                    <Box
                                                        sx={{
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: '50%',
                                                            bgcolor: '#fff',
                                                            boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                                                        }}
                                                    />
                                                )}
                                            </ListItemButton>
                                        </ListItem>
                                    </motion.div>
                                );
                            })}
                        </List>
                    </Box>
                ))}
            </Box>

            <Divider />
            <Box sx={{ p: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.25,
                        borderRadius: 2.5,
                        bgcolor: alpha(theme.palette.primary.main, isDark ? 0.10 : 0.06),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 38,
                            height: 38,
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        }}
                    >
                        {getInitial(user?.name)}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.1 }} noWrap>
                            {user?.name || 'Utilizator'}
                        </Typography>
                        <Chip
                            size="small"
                            label={ROLE_LABELS[user?.role] || 'Utilizator'}
                            sx={{
                                mt: 0.5,
                                height: 18,
                                fontSize: 10,
                                fontWeight: 700,
                                bgcolor: alpha(theme.palette.primary.main, 0.18),
                                color: theme.palette.primary.main,
                                '& .MuiChip-label': { px: 0.75 },
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
}

export default SideMenu;
