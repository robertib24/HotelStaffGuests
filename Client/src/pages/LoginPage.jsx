import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    TextField,
    Typography,
    Box,
    Alert,
    Paper,
    InputAdornment,
    IconButton,
    Divider,
    CircularProgress,
    useTheme,
    alpha,
} from '@mui/material';
import HotelIcon from '@mui/icons-material/NightShelter';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import { motion } from 'framer-motion';

const FEATURES = [
    {
        icon: <BoltOutlinedIcon />,
        title: 'Operațiuni rapide',
        text: 'Gestionezi rezervări, camere și echipa în câteva clickuri.',
    },
    {
        icon: <InsightsOutlinedIcon />,
        title: 'Insights în timp real',
        text: 'Statistici live pentru ocupare, venituri și flux oaspeți.',
    },
    {
        icon: <ShieldOutlinedIcon />,
        title: 'Roluri și securitate',
        text: 'Acces granular pentru manageri, recepție, housekeeping & chef.',
    },
];

function LoginPage() {
    const [email, setEmail] = useState('admin@hotel.com');
    const [password, setPassword] = useState('1234');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const success = await auth.login(email, password);
            if (success) {
                navigate('/');
            } else {
                setError('Email sau parolă incorectă.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (mail, pw) => {
        setEmail(mail);
        setPassword(pw);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                position: 'relative',
                overflow: 'hidden',
                bgcolor: 'background.default',
            }}
        >
            {/* Left brand panel */}
            <Box
                sx={{
                    flex: { xs: 'unset', md: 1.1 },
                    minHeight: { xs: 320, md: 'unset' },
                    position: 'relative',
                    color: '#fff',
                    p: { xs: 4, md: 8 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    background: `linear-gradient(135deg,
                        ${theme.palette.primary.main} 0%,
                        ${theme.palette.secondary.main} 60%,
                        ${alpha(theme.palette.primary.main, 0.85)} 100%)`,
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 12s ease infinite',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background:
                            'radial-gradient(circle at 22% 25%, rgba(255,255,255,0.18) 0, transparent 45%), radial-gradient(circle at 78% 75%, rgba(255,255,255,0.14) 0, transparent 50%)',
                        animation: 'float 8s ease-in-out infinite',
                        pointerEvents: 'none',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background:
                            'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.18) 100%)',
                        pointerEvents: 'none',
                    },
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0)' },
                        '50%': { transform: 'translateY(-12px)' },
                    },
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2.5,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: 'rgba(255,255,255,0.18)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        <HotelIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
                            Hotel Admin
                        </Typography>
                        <Typography sx={{ fontSize: 12, opacity: 0.85 }}>
                            Management Suite
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 540 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: 32, md: 44 },
                                fontWeight: 800,
                                lineHeight: 1.1,
                                letterSpacing: '-0.025em',
                                textShadow: '0 4px 24px rgba(0,0,0,0.18)',
                                mb: 2,
                            }}
                        >
                            Hotelul tău, sub control. Modern. Vizual. Eficient.
                        </Typography>
                        <Typography sx={{ opacity: 0.92, fontSize: 16, lineHeight: 1.55, mb: 4 }}>
                            Un panou unic pentru recepție, housekeeping, chef și management — cu
                            statistici live și un design plăcut de utilizat.
                        </Typography>
                    </motion.div>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        p: 1.5,
                                        borderRadius: 2.5,
                                        bgcolor: 'rgba(255,255,255,0.10)',
                                        border: '1px solid rgba(255,255,255,0.18)',
                                        backdropFilter: 'blur(8px)',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 2,
                                            display: 'grid',
                                            placeItems: 'center',
                                            bgcolor: 'rgba(255,255,255,0.18)',
                                        }}
                                    >
                                        {f.icon}
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                                            {f.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: 12.5, opacity: 0.85 }}>
                                            {f.text}
                                        </Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ position: 'relative', zIndex: 1, fontSize: 12, opacity: 0.85 }}>
                    © {new Date().getFullYear()} Hotel Admin · Built with care
                </Box>
            </Box>

            {/* Right form */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: { xs: 6, md: 8 },
                    px: { xs: 2, sm: 4 },
                }}
            >
                <Paper
                    component={motion.div}
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    elevation={0}
                    sx={{
                        width: '100%',
                        maxWidth: 460,
                        p: { xs: 3, sm: 5 },
                        borderRadius: 4,
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{ fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', mb: 0.5 }}
                    >
                        Bine ai revenit <span style={{ display: 'inline-block' }}>👋</span>
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 3.5, fontSize: 14.5 }}>
                        Autentifică-te pentru a continua spre dashboard.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            </motion.div>
                        )}

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Adresă Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Parolă"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((s) => !s)}
                                            edge="end"
                                            size="small"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <VisibilityOffOutlinedIcon fontSize="small" />
                                            ) : (
                                                <VisibilityOutlinedIcon fontSize="small" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                            variant="contained"
                            sx={{ mt: 3, mb: 2.5, py: 1.4, fontSize: 15, fontWeight: 700 }}
                        >
                            {loading ? (
                                <CircularProgress size={22} thickness={5} sx={{ color: '#fff' }} />
                            ) : (
                                'Intră în cont'
                            )}
                        </Button>

                        <Divider sx={{ my: 2, fontSize: 11, color: 'text.secondary' }}>
                            CONTURI DEMO
                        </Divider>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => fillDemo('admin@hotel.com', '1234')}
                                sx={{
                                    justifyContent: 'flex-start',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                                    <span style={{ fontSize: 12.5 }}>Admin</span>
                                    <span style={{ fontSize: 10.5, opacity: 0.7 }}>admin@hotel.com</span>
                                </Box>
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => fillDemo('manager@hotel.com', '1234')}
                                sx={{
                                    justifyContent: 'flex-start',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                                    <span style={{ fontSize: 12.5 }}>Manager</span>
                                    <span style={{ fontSize: 10.5, opacity: 0.7 }}>manager@hotel.com</span>
                                </Box>
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default LoginPage;
