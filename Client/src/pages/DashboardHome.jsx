import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, CircularProgress, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import KingBedIcon from '@mui/icons-material/KingBed';
import BadgeIcon from '@mui/icons-material/Badge';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';

function StatWidget({ title, value, icon, color, trend }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <Card 
                sx={{ 
                    height: '100%',
                    background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
                    border: `1px solid ${color}30`,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '150px',
                        height: '150px',
                        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                    }
                }}
            >
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                                color: 'white',
                                display: 'flex',
                                boxShadow: `0 4px 20px ${color}40`,
                            }}
                        >
                            {icon}
                        </Box>
                        {trend && (
                            <Chip 
                                icon={<TrendingUpIcon />}
                                label={trend}
                                size="small"
                                sx={{ 
                                    background: '#10b98150',
                                    color: '#10b981',
                                    fontWeight: 'bold'
                                }}
                            />
                        )}
                    </Box>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: color }}>
                        {value}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function DashboardHome() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/dashboard/stats', {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                setStats(response.data);
            } catch (error) {
                console.error("Eroare la preluarea statisticilor:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [auth.token]);

    if (loading || !stats) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    return (
        <Box>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Bine ai revenit! 👋
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Iată o privire de ansamblu asupra hotelului tău
                    </Typography>
                </Box>
            </motion.div>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <StatWidget 
                        title="Total Angajați" 
                        value={stats.employeeCount}
                        icon={<BadgeIcon sx={{ fontSize: 28 }} />}
                        color="#3b82f6"
                        trend="+12%"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatWidget 
                        title="Total Oaspeți" 
                        value={stats.guestCount}
                        icon={<PeopleIcon sx={{ fontSize: 28 }} />} 
                        color="#10b981"
                        trend="+8%"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatWidget 
                        title="Total Camere" 
                        value={stats.roomCount}
                        icon={<KingBedIcon sx={{ fontSize: 28 }} />} 
                        color="#f59e0b"
                        trend="+5%"
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Paper 
                            sx={{ 
                                p: 3, 
                                height: 450,
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        Flux Oaspeți
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Activitatea din ultima săptămână
                                    </Typography>
                                </Box>
                                <Chip 
                                    label="Săptămâna Curentă" 
                                    sx={{ 
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </Box>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart
                                    data={stats.weeklyGuestData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorGuests" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#9ca3af" 
                                        tick={{ fill: '#9ca3af' }}
                                        axisLine={{ stroke: '#334155' }}
                                    />
                                    <YAxis 
                                        stroke="#9ca3af" 
                                        tick={{ fill: '#9ca3af' }}
                                        axisLine={{ stroke: '#334155' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                                            border: '1px solid rgba(59, 130, 246, 0.3)',
                                            borderRadius: '12px',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                        }}
                                        itemStyle={{ color: '#e5e7eb', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#9ca3af', marginBottom: '8px' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="Oaspeți" 
                                        stroke="#3b82f6" 
                                        fill="url(#colorGuests)" 
                                        strokeWidth={3}
                                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                                        activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
}

export default DashboardHome;