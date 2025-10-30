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

const drawerWidth = 260;

const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
    { text: 'Rezervări', icon: <ListAltIcon />, path: '/reservations' },
    { text: 'Angajați', icon: <BadgeIcon />, path: '/employees' },
    { text: 'Oaspeți', icon: <PeopleIcon />, path: '/guests' },
    { text: 'Camere', icon: <KingBedIcon />, path: '/rooms' },
    { text: 'Rapoarte', icon: <AssessmentIcon />, path: '/reports' },
];

function SideMenu() {
    const location = useLocation();

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
            <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, py: 3 }}>
                <HotelIcon sx={{ color: 'primary.main', fontSize: '2.5rem' }} />
                <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    Hotel Admin
                </Typography>
            </Toolbar>
            <Box sx={{ overflow: 'auto', px: 2 }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={location.pathname.startsWith(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        '& .MuiListItemIcon-root': {
                                            color: 'white',
                                        },
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        }
                                    },
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}

export default SideMenu;