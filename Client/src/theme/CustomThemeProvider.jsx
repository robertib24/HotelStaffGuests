import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, alpha } from '@mui/material';
import { IconButton, Box, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PaletteIcon from '@mui/icons-material/Palette';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeContext = createContext();

const themes = {
    dark: {
        indigo: { name: 'Indigo Nights', primary: '#6366f1', secondary: '#8b5cf6' },
        blue:   { name: 'Ocean Blue',    primary: '#3b82f6', secondary: '#06b6d4' },
        purple: { name: 'Violet',        primary: '#8b5cf6', secondary: '#ec4899' },
        green:  { name: 'Emerald',       primary: '#10b981', secondary: '#3b82f6' },
        orange: { name: 'Sunset',        primary: '#f59e0b', secondary: '#ef4444' },
        teal:   { name: 'Teal',          primary: '#14b8a6', secondary: '#06b6d4' },
    },
    light: {
        indigo: { name: 'Indigo',        primary: '#4f46e5', secondary: '#7c3aed' },
        blue:   { name: 'Albastru',      primary: '#2563eb', secondary: '#0891b2' },
        purple: { name: 'Violet',        primary: '#7c3aed', secondary: '#db2777' },
        green:  { name: 'Verde',         primary: '#059669', secondary: '#2563eb' },
        orange: { name: 'Portocaliu',    primary: '#d97706', secondary: '#dc2626' },
        teal:   { name: 'Teal',          primary: '#0d9488', secondary: '#0891b2' },
    },
};

export function CustomThemeProvider({ children }) {
    const initialMode = localStorage.getItem('theme-mode') || 'dark';
    const initialColor = localStorage.getItem('theme-color') || 'indigo';
    const [mode, setMode] = useState(themes[initialMode] ? initialMode : 'dark');
    const [colorScheme, setColorScheme] = useState(
        themes[mode] && themes[mode][initialColor] ? initialColor : 'indigo'
    );
    const [showPalette, setShowPalette] = useState(false);

    useEffect(() => {
        localStorage.setItem('theme-mode', mode);
        document.body.setAttribute('data-theme', mode === 'dark' ? 'hotelDark' : 'hotelLight');
        document.documentElement.style.colorScheme = mode;
    }, [mode]);

    useEffect(() => {
        localStorage.setItem('theme-color', colorScheme);
    }, [colorScheme]);

    const currentColors = themes[mode][colorScheme];
    const isDark = mode === 'dark';

    const theme = createTheme({
        palette: {
            mode,
            primary: {
                main: currentColors.primary,
                light: alpha(currentColors.primary, 0.7),
                dark: alpha(currentColors.primary, 0.9),
            },
            secondary: {
                main: currentColors.secondary,
                light: alpha(currentColors.secondary, 0.7),
                dark: alpha(currentColors.secondary, 0.9),
            },
            background: {
                default: isDark ? '#0a0e1a' : '#f8fafc',
                paper: isDark ? 'rgba(15, 23, 42, 0.65)' : '#ffffff',
            },
            divider: isDark ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.08)',
            text: {
                primary: isDark ? '#f1f5f9' : '#0f172a',
                secondary: isDark ? '#94a3b8' : '#475569',
            },
        },
        typography: {
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            h3: { fontWeight: 700, letterSpacing: '-0.02em' },
            h4: { fontWeight: 700, letterSpacing: '-0.02em' },
            h5: { fontWeight: 600, letterSpacing: '-0.01em' },
            h6: { fontWeight: 600, letterSpacing: '-0.01em' },
            button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
        },
        shape: { borderRadius: 14 },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        scrollBehavior: 'smooth',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 18,
                        backgroundImage: 'none',
                        backdropFilter: 'blur(18px) saturate(140%)',
                        WebkitBackdropFilter: 'blur(18px) saturate(140%)',
                        border: isDark
                            ? '1px solid rgba(148,163,184,0.10)'
                            : '1px solid rgba(15,23,42,0.06)',
                        boxShadow: isDark
                            ? '0 12px 40px -16px rgba(0,0,0,0.7), 0 2px 6px -2px rgba(0,0,0,0.3)'
                            : '0 8px 28px -12px rgba(15,23,42,0.18), 0 2px 6px -2px rgba(15,23,42,0.06)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        fontWeight: 600,
                        padding: '10px 22px',
                        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                        boxShadow: 'none',
                    },
                    contained: {
                        background: `linear-gradient(135deg, ${currentColors.primary} 0%, ${currentColors.secondary} 100%)`,
                        boxShadow: `0 8px 24px -8px ${alpha(currentColors.primary, 0.55)}`,
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 14px 32px -10px ${alpha(currentColors.primary, 0.7)}`,
                            background: `linear-gradient(135deg, ${currentColors.primary} 0%, ${currentColors.secondary} 100%)`,
                            filter: 'brightness(1.05)',
                        },
                    },
                    outlined: {
                        borderColor: alpha(currentColors.primary, 0.4),
                        '&:hover': {
                            borderColor: currentColors.primary,
                            backgroundColor: alpha(currentColors.primary, 0.08),
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: { fontWeight: 600, borderRadius: 10 },
                },
            },
            MuiTextField: {
                defaultProps: { variant: 'outlined' },
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 12,
                            backgroundColor: isDark
                                ? 'rgba(15,23,42,0.4)'
                                : 'rgba(255,255,255,0.7)',
                            transition: 'all 0.2s ease',
                            '& fieldset': {
                                borderColor: isDark
                                    ? 'rgba(148,163,184,0.18)'
                                    : 'rgba(15,23,42,0.12)',
                            },
                            '&:hover fieldset': {
                                borderColor: alpha(currentColors.primary, 0.5),
                            },
                            '&.Mui-focused': {
                                backgroundColor: isDark
                                    ? 'rgba(15,23,42,0.6)'
                                    : 'rgba(255,255,255,0.95)',
                                boxShadow: `0 0 0 4px ${alpha(currentColors.primary, 0.15)}`,
                            },
                        },
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: isDark
                            ? 'rgba(10,14,26,0.65)'
                            : 'rgba(255,255,255,0.75)',
                        backdropFilter: 'blur(18px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                        borderBottom: isDark
                            ? '1px solid rgba(148,163,184,0.10)'
                            : '1px solid rgba(15,23,42,0.06)',
                        boxShadow: 'none',
                        color: isDark ? '#f1f5f9' : '#0f172a',
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: isDark
                            ? 'rgba(10,14,26,0.85)'
                            : 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(20px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                        borderRight: isDark
                            ? '1px solid rgba(148,163,184,0.08)'
                            : '1px solid rgba(15,23,42,0.06)',
                        boxShadow: 'none',
                    },
                },
            },
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        border: 'none',
                        backgroundColor: 'transparent',
                        '& .MuiDataGrid-columnHeader': {
                            backgroundColor: isDark
                                ? alpha(currentColors.primary, 0.08)
                                : alpha(currentColors.primary, 0.05),
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase',
                            fontSize: '0.72rem',
                        },
                        '& .MuiDataGrid-row': { transition: 'background-color 0.18s ease' },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: alpha(currentColors.primary, isDark ? 0.12 : 0.06),
                        },
                        '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': {
                            outline: 'none',
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 18,
                        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        backgroundColor: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(15,23,42,0.92)',
                        fontSize: '0.78rem',
                        borderRadius: 8,
                        padding: '6px 10px',
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: { borderRadius: 20 },
                },
            },
        },
    });

    const toggleMode = () => setMode(prev => (prev === 'dark' ? 'light' : 'dark'));

    const value = { mode, colorScheme, toggleMode, setColorScheme, currentColors, themes };

    return (
        <ThemeContext.Provider value={value}>
            <MuiThemeProvider theme={theme}>
                {children}

                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        zIndex: 1300,
                    }}
                >
                    <Tooltip title={`Schimbă în tema ${isDark ? 'light' : 'dark'}`} placement="left">
                        <IconButton
                            onClick={toggleMode}
                            sx={{
                                bgcolor: 'background.paper',
                                border: `1px solid ${theme.palette.divider}`,
                                boxShadow: '0 8px 24px -8px rgba(0,0,0,0.35)',
                                '&:hover': {
                                    bgcolor: 'background.paper',
                                    transform: 'rotate(180deg) scale(1.08)',
                                },
                                transition: 'all 0.4s ease',
                            }}
                        >
                            {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Schimbă culoarea" placement="left">
                        <IconButton
                            onClick={() => setShowPalette(s => !s)}
                            sx={{
                                bgcolor: 'background.paper',
                                border: `1px solid ${theme.palette.divider}`,
                                boxShadow: '0 8px 24px -8px rgba(0,0,0,0.35)',
                                '&:hover': { transform: 'scale(1.1)' },
                                transition: 'all 0.25s ease',
                            }}
                        >
                            <PaletteIcon sx={{ color: currentColors.primary }} />
                        </IconButton>
                    </Tooltip>

                    <AnimatePresence>
                        {showPalette && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85, y: 12 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85, y: 12 }}
                                transition={{ duration: 0.18 }}
                            >
                                <Box
                                    sx={{
                                        bgcolor: 'background.paper',
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 3,
                                        p: 2,
                                        boxShadow: '0 16px 48px -16px rgba(0,0,0,0.45)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 0.75,
                                        minWidth: 220,
                                        backdropFilter: 'blur(20px)',
                                    }}
                                >
                                    <Box sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.secondary', mb: 0.5, px: 0.5 }}>
                                        Schemă de culori
                                    </Box>
                                    {Object.entries(themes[mode]).map(([key, colors]) => {
                                        const active = colorScheme === key;
                                        return (
                                            <Box
                                                key={key}
                                                onClick={() => { setColorScheme(key); setShowPalette(false); }}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    p: 1,
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    border: active
                                                        ? `1.5px solid ${colors.primary}`
                                                        : '1.5px solid transparent',
                                                    bgcolor: active ? alpha(colors.primary, 0.12) : 'transparent',
                                                    '&:hover': { bgcolor: alpha(colors.primary, 0.08) },
                                                    transition: 'all 0.18s ease',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: 1.5,
                                                        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                                        boxShadow: `0 6px 16px -4px ${alpha(colors.primary, 0.55)}`,
                                                    }}
                                                />
                                                <Box sx={{ fontSize: 13, fontWeight: 500 }}>
                                                    {colors.name}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within CustomThemeProvider');
    }
    return context;
}
