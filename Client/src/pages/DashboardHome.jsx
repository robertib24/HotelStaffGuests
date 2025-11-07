import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import KingBedIcon from '@mui/icons-material/KingBed';
import BadgeIcon from '@mui/icons-material/Badge';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BuildIcon from '@mui/icons-material/Build';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { DashboardCardSkeleton, ChartSkeleton } from '../components/LoadingSkeletons';

function StatWidget({ title, value, icon, color, trend, onClick }) {
    const cardContent = (
        <Card 
            sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
                border: `1.5px solid ${color}40`,
                position: 'relative',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : 'default',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: '200px',
                    height: '200px',
                    background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
                    animation: 'pulse 3s ease-in-out infinite',
                },
                '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: 0.5 },
                    '50%': { transform: 'scale(1.1)', opacity: 0.8 }
                }
            }}
            onClick={onClick}
        >
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 2.5,
                                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                                color: 'white',
                                display: 'flex',
                                boxShadow: `0 8px 24px ${color}50`,
                            }}
                        >
                            {icon}
                        </Box>
                    </motion.div>
                    {trend && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Chip 
                                icon={<TrendingUpIcon />}
                                label={trend}
                                size="small"
                                sx={{ 
                                    background: '#10b98160',
                                    color: '#10b981',
                                    fontWeight: 'bold',
                                    backdropFilter: 'blur(10px)',
                                }}
                            />
                        </motion.div>
                    )}
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
                    {title}
                </Typography>
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: color, textShadow: `0 0 20px ${color}40` }}>
                        {value}
                    </Typography>
                </motion.div>
            </CardContent>
        </Card>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ y: onClick ? -8 : 0, scale: onClick ? 1.02 : 1, transition: { duration: 0.2 } }}
        >
            {cardContent}
        </motion.div>
    );
}

const WelcomeHeader = ({ name }) => (
    <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
    >
        <Box sx={{ mb: 4 }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Bine ai revenit, {name}! 👋
                </Typography>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Typography variant="body1" color="text.secondary">
                    Iată o privire de ansamblu asupra hotelului tău
                </Typography>
            </motion.div>
        </Box>
    </motion.div>
);

const ManagerDashboard = ({ stats }) => (
    <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
            <StatWidget 
                title="Total Angajați" 
                value={stats.employeeCount}
                icon={<BadgeIcon sx={{ fontSize: 28 }} />}
                color="#3b82f6"
            />
        </Grid>
        <Grid item xs={12} md={4}>
            <StatWidget 
                title="Total Oaspeți" 
                value={stats.guestCount}
                icon={<PeopleIcon sx={{ fontSize: 28 }} />} 
                color="#10b981"
            />
        </Grid>
        <Grid item xs={12} md={4}>
            <StatWidget 
                title="Total Camere" 
                value={stats.roomCount}
                icon={<KingBedIcon sx={{ fontSize: 28 }} />} 
                color="#f59e0b"
            />
        </Grid>
        
        <Grid item xs={12}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
            >
                <Paper 
                    sx={{ 
                        p: 4, 
                        height: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                        border: '1.5px solid rgba(59, 130, 246, 0.25)',
                    }}
                >
                    <Box sx={{ mb: 3, flexShrink: 0 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            📊 Flux Oaspeți (Check-ins)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Activitatea din ultima săptămână
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.weeklyGuestData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorGuests" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#334155' }} />
                                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#334155' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '12px',
                                    }}
                                />
                                <Area type="monotone" dataKey="Oaspeți" stroke="#3b82f6" fill="url(#colorGuests)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </motion.div>
        </Grid>
    </Grid>
);

const ReceptionistDashboard = ({ stats }) => {
    const navigate = useNavigate();
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <StatWidget 
                    title="Camere Disponibile (Curate)" 
                    value={stats.availableRooms}
                    icon={<EventAvailableIcon sx={{ fontSize: 28 }} />}
                    color="#10b981"
                    onClick={() => navigate('/rooms')}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <StatWidget 
                    title="Camere Ocupate" 
                    value={stats.occupiedRooms}
                    icon={<MeetingRoomIcon sx={{ fontSize: 28 }} />} 
                    color="#ef4444"
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <StatWidget 
                    title="Necesită Curățenie" 
                    value={stats.needsCleaningRooms}
                    icon={<CleaningServicesIcon sx={{ fontSize: 28 }} />} 
                    color="#f59e0b"
                    onClick={() => navigate('/housekeeping')}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <StatWidget 
                    title="În Mentenanță" 
                    value={stats.inMaintenanceRooms}
                    icon={<BuildIcon sx={{ fontSize: 28 }} />} 
                    color="#64748b"
                />
            </Grid>
        </Grid>
    );
};

const CleanerDashboard = ({ stats }) => {
    const navigate = useNavigate();
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <StatWidget 
                    title="Camere ce Necesită Curățenie" 
                    value={stats.needsCleaningRooms}
                    icon={<CleaningServicesIcon sx={{ fontSize: 32 }} />}
                    color="#f59e0b"
                    onClick={() => navigate('/housekeeping')}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <StatWidget 
                    title="Camere Curate" 
                    value={stats.availableRooms}
                    icon={<EventAvailableIcon sx={{ fontSize: 32 }} />} 
                    color="#10b981"
                />
            </Grid>
        </Grid>
    );
};

function DashboardHome() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/dashboard/stats', {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                setStats(response.data);
            } catch (error) {
                console.error("Eroare la preluarea statisticilor:", error);
                showToast('Eroare la preluarea statisticilor', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [auth.token, showToast]);

    const renderSkeletons = () => (
        <Box>
            <WelcomeHeader name="..." />
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <DashboardCardSkeleton />
                </Grid>
                <Grid item xs={12} md={4}>
                    <DashboardCardSkeleton />
                </Grid>
                <Grid item xs={12} md={4}>
                    <DashboardCardSkeleton />
                </Grid>
                
                <Grid item xs={12}>
                    <Paper 
                        sx={{ 
                            p: 4, 
                            height: 500,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <ChartSkeleton />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );

    const renderDashboardByRole = () => {
        if (!stats || !auth.user) return renderSkeletons();

        switch (auth.user.role) {
            case 'ROLE_Admin':
            case 'ROLE_Manager':
                return <ManagerDashboard stats={stats} />;
            case 'ROLE_Receptionist':
                return <ReceptionistDashboard stats={stats} />;
            case 'ROLE_Cleaner':
                return <CleanerDashboard stats={stats} />;
            default:
                return (
                    <Typography>
                        Bine ai venit! Nu există un dashboard configurat pentru rolul tău.
                    </Typography>
                );
        }
    };

    if (loading) {
        return renderSkeletons();
    }

    return (
        <Box>
            <WelcomeHeader name={auth.user?.name || 'Utilizator'} />
            {renderDashboardByRole()}
        </Box>
    );
}

export default DashboardHome;