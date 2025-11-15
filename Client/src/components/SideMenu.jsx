import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Typography } from '@mui/material';
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

const drawerWidth = 260;

const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
    { text: 'Rezervări', icon: <ListAltIcon />, path: '/reservations', roles: ['ROLE_Admin', 'ROLE_Manager', 'ROLE_Receptionist'] },
    { text: 'Angajați', icon: <BadgeIcon />, path: '/employees', roles: ['ROLE_Admin'] },
    { text: 'Oaspeți', icon: <PeopleIcon />, path: '/guests', roles: ['ROLE_Admin', 'ROLE_Manager', 'ROLE_Receptionist'] },
    { text: 'Camere', icon: <KingBedIcon />, path: '/rooms', roles: ['ROLE_Admin', 'ROLE_Manager', 'ROLE_Receptionist', 'ROLE_Cleaner'] },
    { text: 'Curățenie', icon: <CleaningServicesIcon />, path: '/housekeeping', roles: ['ROLE_Admin', 'ROLE_Manager', 'ROLE_Cleaner'] },
    { text: 'Room Service', icon: <RoomServiceIcon />, path: '/room-service', roles: ['ROLE_Admin', 'ROLE_Manager', 'ROLE_Chef'] },
    { text: 'Cereri Curățenie', icon: <BuildIcon />, path: '/housekeeping-requests', roles: ['ROLE_Admin', 'ROLE_Manager', 'ROLE_Cleaner'] },
    { text: 'Rapoarte', icon: <AssessmentIcon />, path: '/reports', roles: ['ROLE_Admin'] },
];

function SideMenu() {
    const location = useLocation();
    const { user } = useAuth();

    const visibleItems = menuItems.filter(item => {
        if (!item.roles) return true; 
        return item.roles.includes(user?.role);
    });

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                >
                    <HotelIcon sx={{ color: 'primary.main', fontSize: '3rem', filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }} />
                </motion.div>
                <Box>
                    <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
                        Hotel Admin
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Management System
                    </Typography>
                </Box>
            </Toolbar>
            <Box sx={{ overflow: 'auto', px: 2 }}>
                <List>
                    {visibleItems.map((item, index) => (
                        <motion.div
                            key={item.text}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ListItem disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    selected={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))}
                                    sx={{
                                        borderRadius: 3,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&.Mui-selected': {
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            transform: 'translateX(8px)',
                                            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
                                            '& .MuiListItemIcon-root': {
                                                color: 'white',
                                            },
                                            '&:hover': {
                                                backgroundColor: 'primary.dark',
                                                transform: 'translateX(12px)',
                                            }
                                        },
                                        '&:hover': {
                                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                            transform: 'translateX(4px)',
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                                </ListItemButton>
                            </ListItem>
                        </motion.div>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}

export default SideMenu;