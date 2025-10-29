import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import KingBedIcon from '@mui/icons-material/KingBed';
import BadgeIcon from '@mui/icons-material/Badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function StatWidget({ title, value, icon, color }) {
    return (
        <Card sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%' }}>
            <Box sx={{
                mr: 2,
                p: 2.5,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${color}.main`,
                color: 'white'
            }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
            </Box>
        </Card>
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
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <StatWidget 
                        title="Total Angajați" 
                        value={stats.employeeCount}
                        icon={<BadgeIcon />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatWidget 
                        title="Total Oaspeți" 
                        value={stats.guestCount}
                        icon={<PeopleIcon />} 
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatWidget 
                        title="Total Camere" 
                        value={stats.roomCount}
                        icon={<KingBedIcon />} 
                        color="error"
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, height: 400 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Flux Oaspeți (Săptămâna Curentă)
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <AreaChart
                                data={stats.weeklyGuestData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorGuests" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                />
                                <Area type="monotone" dataKey="Oaspeți" stroke="#3b82f6" fill="url(#colorGuests)" fillOpacity={1} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default DashboardHome;