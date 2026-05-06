import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Chip, useTheme, alpha } from '@mui/material';
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { DashboardCardSkeleton, ChartSkeleton } from '../components/LoadingSkeletons';

function AnimatedCounter({ value, duration = 1400 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let frame;
        const animate = (now) => {
            if (!startTime) startTime = now;
            const p = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(value * eased));
            if (p < 1) frame = requestAnimationFrame(animate);
            else setCount(value);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [value, duration]);

    return <>{count}</>;
}

function StatWidget({ title, value, icon, color, trend, onClick, subtitle }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, type: 'spring', stiffness: 110 }}
            whileHover={onClick ? { y: -3 } : { y: 0 }}
            style={{ height: '100%' }}
        >
            <Card
                onClick={onClick}
                sx={{
                    height: '100%',
                    minHeight: 168,
                    cursor: onClick ? 'pointer' : 'default',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 3,
                    background: (t) => t.palette.mode === 'dark'
                        ? `linear-gradient(135deg, ${alpha(color, 0.18)} 0%, ${alpha(color, 0.05)} 60%, transparent 100%)`
                        : `linear-gradient(135deg, ${alpha(color, 0.12)} 0%, ${alpha(color, 0.04)} 60%, transparent 100%)`,
                    border: (t) => `1px solid ${alpha(color, t.palette.mode === 'dark' ? 0.3 : 0.22)}`,
                    boxShadow: `0 14px 36px -18px ${alpha(color, 0.5)}`,
                    transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -90,
                        right: -90,
                        width: 240,
                        height: 240,
                        background: `radial-gradient(circle, ${alpha(color, 0.35)} 0%, transparent 70%)`,
                        filter: 'blur(2px)',
                        pointerEvents: 'none',
                    },
                    '&:hover': onClick ? {
                        boxShadow: `0 22px 48px -18px ${alpha(color, 0.65)}`,
                        borderColor: alpha(color, 0.55),
                    } : {},
                }}
            >
                <CardContent
                    sx={{
                        p: 3,
                        position: 'relative',
                        zIndex: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2.5,
                                display: 'grid',
                                placeItems: 'center',
                                color: '#fff',
                                background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.75)} 100%)`,
                                boxShadow: `0 12px 28px -10px ${alpha(color, 0.65)}`,
                            }}
                        >
                            {icon}
                        </Box>
                        {trend && (
                            <Chip
                                icon={<TrendingUpIcon style={{ fontSize: 14 }} />}
                                label={trend}
                                size="small"
                                sx={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    height: 24,
                                    '& .MuiChip-icon': { color: '#fff' },
                                }}
                            />
                        )}
                        {onClick && !trend && (
                            <Box
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    display: 'grid',
                                    placeItems: 'center',
                                    bgcolor: alpha(color, 0.15),
                                    color: color,
                                    transition: 'all 0.2s ease',
                                    '.MuiCard-root:hover &': {
                                        bgcolor: color,
                                        color: '#fff',
                                        transform: 'translateX(2px)',
                                    },
                                }}
                            >
                                <ArrowForwardIcon sx={{ fontSize: 16 }} />
                            </Box>
                        )}
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: 12.5,
                                fontWeight: 600,
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                color: 'text.secondary',
                                mb: 0.5,
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: 40,
                                lineHeight: 1.05,
                                letterSpacing: '-0.025em',
                                background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            <AnimatedCounter value={value || 0} />
                        </Typography>
                        {subtitle && (
                            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5 }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function WelcomeHeader({ name }) {
    const today = new Date().toLocaleDateString('ro-RO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography
                        sx={{
                            fontSize: { xs: 24, md: 30 },
                            fontWeight: 800,
                            letterSpacing: '-0.025em',
                            mb: 0.5,
                        }}
                    >
                        Bine ai revenit, <span className="gradient-text">{name}</span> 👋
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14.5 }}>
                        Iată o privire de ansamblu asupra hotelului tău.
                    </Typography>
                </Box>
                <Chip
                    label={today.charAt(0).toUpperCase() + today.slice(1)}
                    sx={{
                        fontWeight: 600,
                        bgcolor: 'background.paper',
                        border: (t) => `1px solid ${t.palette.divider}`,
                    }}
                />
            </Box>
        </motion.div>
    );
}

function ManagerDashboard({ stats }) {
    const theme = useTheme();
    return (
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatWidget title="Total Angajați" value={stats.employeeCount} icon={<BadgeIcon sx={{ fontSize: 28 }} />} color="#6366f1" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatWidget title="Total Oaspeți" value={stats.guestCount} icon={<PeopleIcon sx={{ fontSize: 28 }} />} color="#10b981" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatWidget title="Total Camere" value={stats.roomCount} icon={<KingBedIcon sx={{ fontSize: 28 }} />} color="#f59e0b" />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <StatWidget title="Camere Disponibile" value={stats.availableRooms} icon={<EventAvailableIcon sx={{ fontSize: 28 }} />} color="#10b981" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <StatWidget title="Camere Ocupate" value={stats.occupiedRooms} icon={<MeetingRoomIcon sx={{ fontSize: 28 }} />} color="#ef4444" />
                </Grid>
            </Grid>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
            >
                <Paper
                    sx={{
                        p: { xs: 2.5, md: 4 },
                        height: 480,
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        },
                    }}
                >
                    <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                        <Box>
                            <Typography sx={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>
                                Flux Oaspeți (Check-ins)
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                                Activitatea din ultima săptămână
                            </Typography>
                        </Box>
                        <Chip
                            size="small"
                            label="Live"
                            sx={{
                                fontWeight: 700,
                                bgcolor: alpha(theme.palette.success.main, 0.15),
                                color: theme.palette.success.main,
                                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                            }}
                        />
                    </Box>

                    <Box sx={{ flex: 1, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.weeklyGuestData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorGuests" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.6} />
                                        <stop offset="60%" stopColor={theme.palette.secondary.main} stopOpacity={0.25} />
                                        <stop offset="100%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke={alpha(theme.palette.text.secondary, 0.18)} vertical={false} />
                                <XAxis dataKey="name" stroke={theme.palette.text.secondary} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis stroke={theme.palette.text.secondary} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.98)',
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 12,
                                        boxShadow: '0 16px 40px -12px rgba(0,0,0,0.3)',
                                        color: theme.palette.text.primary,
                                    }}
                                    cursor={{ stroke: alpha(theme.palette.primary.main, 0.4), strokeWidth: 2, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Oaspeți"
                                    stroke={theme.palette.primary.main}
                                    fill="url(#colorGuests)"
                                    strokeWidth={2.5}
                                    animationDuration={1400}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
}

function ReceptionistDashboard({ stats }) {
    const navigate = useNavigate();
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <StatWidget title="Camere Disponibile" subtitle="Curate, gata de check-in" value={stats.availableRooms} icon={<EventAvailableIcon sx={{ fontSize: 28 }} />} color="#10b981" onClick={() => navigate('/rooms')} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <StatWidget title="Camere Ocupate" value={stats.occupiedRooms} icon={<MeetingRoomIcon sx={{ fontSize: 28 }} />} color="#ef4444" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <StatWidget title="Necesită Curățenie" value={stats.needsCleaningRooms} icon={<CleaningServicesIcon sx={{ fontSize: 28 }} />} color="#f59e0b" onClick={() => navigate('/housekeeping')} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <StatWidget title="În Mentenanță" value={stats.inMaintenanceRooms} icon={<BuildIcon sx={{ fontSize: 28 }} />} color="#64748b" />
            </Grid>
        </Grid>
    );
}

function CleanerDashboard({ stats }) {
    const navigate = useNavigate();
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <StatWidget title="Camere ce Necesită Curățenie" value={stats.needsCleaningRooms} icon={<CleaningServicesIcon sx={{ fontSize: 32 }} />} color="#f59e0b" onClick={() => navigate('/housekeeping')} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <StatWidget title="Camere Curate" value={stats.availableRooms} icon={<CheckCircleIcon sx={{ fontSize: 32 }} />} color="#10b981" />
            </Grid>
        </Grid>
    );
}

function ChefDashboard({ stats }) {
    const navigate = useNavigate();
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
                <StatWidget title="Cereri în Așteptare" value={stats.pendingRoomServiceRequests || 0} icon={<PendingIcon sx={{ fontSize: 28 }} />} color="#f59e0b" onClick={() => navigate('/room-service')} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatWidget title="În Lucru" value={stats.inProgressRoomServiceRequests || 0} icon={<RestaurantIcon sx={{ fontSize: 28 }} />} color="#3b82f6" onClick={() => navigate('/room-service')} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatWidget title="Finalizate Astăzi" value={stats.completedTodayRoomServiceRequests || 0} icon={<CheckCircleIcon sx={{ fontSize: 28 }} />} color="#10b981" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatWidget title="Total Cereri" value={stats.totalRoomServiceRequests || 0} icon={<RoomServiceIcon sx={{ fontSize: 28 }} />} color="#8b5cf6" />
            </Grid>
        </Grid>
    );
}

function DashboardHome() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                await axios.post('http://localhost:8080/api/rooms/sync-status', {}, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                const response = await axios.get('http://localhost:8080/api/dashboard/stats', {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                setStats(response.data);
            } catch (error) {
                console.error('Eroare la preluarea statisticilor:', error);
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
                <Grid item xs={12} md={4}><DashboardCardSkeleton /></Grid>
                <Grid item xs={12} md={4}><DashboardCardSkeleton /></Grid>
                <Grid item xs={12} md={4}><DashboardCardSkeleton /></Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, height: 480 }}>
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
                    <Typography>Bine ai venit! Nu există un dashboard configurat pentru rolul tău.</Typography>
                );
        }
    };

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            {loading ? (
                renderSkeletons()
            ) : (
                <>
                    <WelcomeHeader name={auth.user?.name || 'Utilizator'} />
                    {renderDashboardByRole()}
                </>
            )}
        </Box>
    );
}

export default DashboardHome;
