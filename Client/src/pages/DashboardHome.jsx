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
import RoomServiceIcon from '@mui/icons-material/RoomService';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion, useAnimation } from 'framer-motion';
import axios from 'axios';
import { DashboardCardSkeleton, ChartSkeleton } from '../components/LoadingSkeletons';

function AnimatedCounter({ value, duration = 2000 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = (currentTime - startTime) / duration;

            if (progress < 1) {
                setCount(Math.floor(value * progress));
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(value);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return <>{count}</>;
}

function StatWidget({ title, value, icon, color, trend, onClick }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            whileHover={onClick ? { y: -4 } : {}}
            style={{ height: '100%' }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Card
                sx={{
                    height: '100%',
                    minHeight: 180,
                    background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
                    border: 'none',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: onClick ? 'pointer' : 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: isHovered
                        ? `0 20px 40px -12px ${color}50, 0 0 0 1px ${color}30`
                        : `0 8px 16px -8px ${color}30, 0 0 0 1px ${color}20`,
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: '300px',
                        height: '300px',
                        background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
                        animation: 'pulse 4s ease-in-out infinite',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -50,
                        left: -50,
                        width: '200px',
                        height: '200px',
                        background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
                        animation: 'pulse 3s ease-in-out infinite reverse',
                    },
                    '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)', opacity: 0.5 },
                        '50%': { transform: 'scale(1.2)', opacity: 0.9 }
                    }
                }}
                onClick={onClick}
            >
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.7, type: "spring" }}
                        >
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 3,
                                    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 12px 32px ${color}60`,
                                }}
                            >
                                {icon}
                            </Box>
                        </motion.div>
                        {trend && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ delay: 0.4, type: "spring" }}
                            >
                                <Chip
                                    icon={<TrendingUpIcon />}
                                    label={trend}
                                    size="small"
                                    sx={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                                    }}
                                />
                            </motion.div>
                        )}
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 1.5, textAlign: 'center' }}>
                            {title}
                        </Typography>
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                        >
                            <Typography variant="h3" sx={{
                                fontWeight: 'bold',
                                color: color,
                                textAlign: 'center',
                                textShadow: `0 0 30px ${color}50`,
                                background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                <AnimatedCounter value={value} />
                            </Typography>
                        </motion.div>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
}

const WelcomeHeader = ({ name }) => (
    <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
    >
        <Box sx={{ mb: 5, position: 'relative' }}>
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    mb: 1.5, 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent',
                    animation: 'gradientShift 3s ease infinite',
                    '@keyframes gradientShift': {
                        '0%, 100%': { backgroundPosition: '0% 50%' },
                        '50%': { backgroundPosition: '100% 50%' }
                    }
                }}>
                    Bine ai revenit, {name}! 👋
                </Typography>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: -30 }}
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Grid container spacing={3} sx={{ mb: 4, maxWidth: '100%' }} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
                <StatWidget
                    title="Total Angajați"
                    value={stats.employeeCount}
                    icon={<BadgeIcon sx={{ fontSize: 32 }} />}
                    color="#3b82f6"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <StatWidget
                    title="Total Oaspeți"
                    value={stats.guestCount}
                    icon={<PeopleIcon sx={{ fontSize: 32 }} />}
                    color="#10b981"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <StatWidget
                    title="Total Camere"
                    value={stats.roomCount}
                    icon={<KingBedIcon sx={{ fontSize: 32 }} />}
                    color="#f59e0b"
                />
            </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ maxWidth: '100%' }} justifyContent="center">
            <Grid item xs={12} md={6}>
                <StatWidget
                    title="Camere Disponibile"
                    value={stats.availableRooms}
                    icon={<EventAvailableIcon sx={{ fontSize: 32 }} />}
                    color="#10b981"
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <StatWidget
                    title="Camere Ocupate"
                    value={stats.occupiedRooms}
                    icon={<MeetingRoomIcon sx={{ fontSize: 32 }} />}
                    color="#ef4444"
                />
            </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1, maxWidth: '100%' }} justifyContent="center">
            <Grid item xs={12}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5, type: "spring" }}
                >
                    <Paper
                        sx={{
                            p: 4,
                            height: 500,
                            display: 'flex',
                            flexDirection: 'column',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                            border: 'none',
                            boxShadow: '0 8px 16px -8px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2)',
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: 3,
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                                backgroundSize: '200% 100%',
                                animation: 'slideGradient 3s ease infinite',
                            },
                            '@keyframes slideGradient': {
                                '0%, 100%': { backgroundPosition: '0% 0%' },
                                '50%': { backgroundPosition: '100% 0%' }
                            }
                        }}
                    >
                        <Box sx={{ mb: 3, flexShrink: 0, textAlign: 'center' }}>
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
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                                            <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                                    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#334155' }} />
                                    <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#334155' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(30, 41, 59, 0.98)',
                                            border: '1px solid rgba(59, 130, 246, 0.3)',
                                            borderRadius: '12px',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="Oaspeți"
                                        stroke="#3b82f6"
                                        fill="url(#colorGuests)"
                                        strokeWidth={3}
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </motion.div>
            </Grid>
        </Grid>
    </Box>
);

const ReceptionistDashboard = ({ stats }) => {
    const navigate = useNavigate();
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Grid container spacing={3} sx={{ maxWidth: '100%' }} justifyContent="center">
                <Grid item xs={12} sm={6} md={6}>
                    <StatWidget
                        title="Camere Disponibile (Curate)"
                        value={stats.availableRooms}
                        icon={<EventAvailableIcon sx={{ fontSize: 32 }} />}
                        color="#10b981"
                        onClick={() => navigate('/rooms')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <StatWidget
                        title="Camere Ocupate"
                        value={stats.occupiedRooms}
                        icon={<MeetingRoomIcon sx={{ fontSize: 32 }} />}
                        color="#ef4444"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <StatWidget
                        title="Necesită Curățenie"
                        value={stats.needsCleaningRooms}
                        icon={<CleaningServicesIcon sx={{ fontSize: 32 }} />}
                        color="#f59e0b"
                        onClick={() => navigate('/housekeeping')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <StatWidget
                        title="În Mentenanță"
                        value={stats.inMaintenanceRooms}
                        icon={<BuildIcon sx={{ fontSize: 32 }} />}
                        color="#64748b"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

const CleanerDashboard = ({ stats }) => {
    const navigate = useNavigate();
    const totalRooms = stats.availableRooms + stats.needsCleaningRooms + stats.occupiedRooms + stats.inMaintenanceRooms;
    const completionPercentage = totalRooms > 0 ? Math.round((stats.availableRooms / totalRooms) * 100) : 0;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Grid container spacing={3} sx={{ maxWidth: '100%' }} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <StatWidget
                        title="Camere ce Necesită Curățenie"
                        value={stats.needsCleaningRooms}
                        icon={<CleaningServicesIcon sx={{ fontSize: 36 }} />}
                        color="#f59e0b"
                        onClick={() => navigate('/housekeeping')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatWidget
                        title="Camere Curate"
                        value={stats.availableRooms}
                        icon={<CheckCircleIcon sx={{ fontSize: 36 }} />}
                        color="#10b981"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatWidget
                        title="Progres Curățenie"
                        value={completionPercentage}
                        icon={<EventAvailableIcon sx={{ fontSize: 36 }} />}
                        color="#8b5cf6"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

const ChefDashboard = ({ stats }) => {
    const navigate = useNavigate();
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Grid container spacing={3} sx={{ maxWidth: '100%' }} justifyContent="center">
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <StatWidget
                        title="Cereri în Așteptare"
                        value={stats.pendingRoomServiceRequests || 0}
                        icon={<PendingIcon sx={{ fontSize: 32 }} />}
                        color="#f59e0b"
                        onClick={() => navigate('/room-service')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <StatWidget
                        title="În Lucru"
                        value={stats.inProgressRoomServiceRequests || 0}
                        icon={<RestaurantIcon sx={{ fontSize: 32 }} />}
                        color="#3b82f6"
                        onClick={() => navigate('/room-service')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <StatWidget
                        title="Finalizate Astăzi"
                        value={stats.completedTodayRoomServiceRequests || 0}
                        icon={<CheckCircleIcon sx={{ fontSize: 32 }} />}
                        color="#10b981"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <StatWidget
                        title="Total Cereri"
                        value={stats.totalRoomServiceRequests || 0}
                        icon={<RoomServiceIcon sx={{ fontSize: 32 }} />}
                        color="#8b5cf6"
                    />
                </Grid>
            </Grid>
        </Box>
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
            case 'ROLE_Chef':
                return <ChefDashboard stats={stats} />;
            default:
                return (
                    <Typography>
                        Bine ai venit! Nu există un dashboard configurat pentru rolul tău.
                    </Typography>
                );
        }
    };

    if (loading) {
        return (
            <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
                {renderSkeletons()}
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
            <WelcomeHeader name={auth.user?.name || 'Utilizator'} />
            {renderDashboardByRole()}
        </Box>
    );
}

export default DashboardHome;