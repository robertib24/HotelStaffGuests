import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { IconButton, Box, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PaletteIcon from '@mui/icons-material/Palette';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeContext = createContext();

const themes = {
    dark: {
        blue: {
            name: 'Albastru Clasic',
            primary: '#3b82f6',
            secondary: '#8b5cf6',
        },
        purple: {
            name: 'Violet Modern',
            primary: '#8b5cf6',
            secondary: '#ec4899',
        },
        green: {
            name: 'Verde Natural',
            primary: '#10b981',
            secondary: '#3b82f6',
        },
        orange: {
            name: 'Portocaliu Energic',
            primary: '#f59e0b',
            secondary: '#ef4444',
        },
        teal: {
            name: 'Teal Profesional',
            primary: '#14b8a6',
            secondary: '#06b6d4',
        }
    },
    light: {
        blue: {
            name: 'Albastru Luminos',
            primary: '#2563eb',
            secondary: '#7c3aed',
        },
        purple: {
            name: 'Violet Elegant',
            primary: '#7c3aed',
            secondary: '#db2777',
        },
        green: {
            name: 'Verde Prosper',
            primary: '#059669',
            secondary: '#2563eb',
        },
        orange: {
            name: 'Portocaliu Solar',
            primary: '#d97706',
            secondary: '#dc2626',
        },
        teal: {
            name: 'Teal Curat',
            primary: '#0d9488',
            secondary: '#0891b2',
        }
    }
};

export function CustomThemeProvider({ children }) {
    const [mode, setMode] = useState(() => localStorage.getItem('theme-mode') || 'dark');
    const [colorScheme, setColorScheme] = useState(() => localStorage.getItem('theme-color') || 'blue');
    const [showPalette, setShowPalette] = useState(false);

    useEffect(() => {
        localStorage.setItem('theme-mode', mode);
    }, [mode]);

    useEffect(() => {
        localStorage.setItem('theme-color', colorScheme);
    }, [colorScheme]);

    const currentColors = themes[mode][colorScheme];

    const theme = createTheme({
        palette: {
            mode: mode,
            primary: {
                main: currentColors.primary,
                light: mode === 'dark' ? '#60a5fa' : '#93c5fd',
                dark: mode === 'dark' ? '#2563eb' : '#1e40af',
            },
            secondary: {
                main: currentColors.secondary,
                light: mode === 'dark' ? '#a78bfa' : '#c4b5fd',
                dark: mode === 'dark' ? '#7c3aed' : '#6d28d9',
            },
            background: {
                default: mode === 'dark' ? '#0a0e1a' : '#f9fafb',
                paper: mode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
            },
            text: {
                primary: mode === 'dark' ? '#f1f5f9' : '#111827',
                secondary: mode === 'dark' ? '#94a3b8' : '#6b7280',
            },
        },
        typography: {
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            h4: { fontWeight: 700, letterSpacing: '-0.02em' },
            h5: { fontWeight: 600, letterSpacing: '-0.01em' },
            h6: { fontWeight: 600, letterSpacing: '-0.01em' },
        },
        shape: {
            borderRadius: 16,
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 20,
                        backgroundImage: 'none',
                        backdropFilter: 'blur(20px)',
                        border: mode === 'dark' 
                            ? '1px solid rgba(255, 255, 255, 0.08)' 
                            : '1px solid rgba(0, 0, 0, 0.08)',
                        boxShadow: mode === 'dark'
                            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                            : '0 4px 16px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        textTransform: 'none',
                        fontWeight: 600,
                        padding: '10px 24px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 24px ${currentColors.primary}40`,
                        },
                    }
                }
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: mode === 'dark' 
                            ? 'rgba(10, 14, 26, 0.8)' 
                            : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: mode === 'dark'
                            ? '1px solid rgba(255, 255, 255, 0.08)'
                            : '1px solid rgba(0, 0, 0, 0.08)',
                        boxShadow: mode === 'dark'
                            ? '0 4px 24px rgba(0, 0, 0, 0.3)'
                            : '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }
                }
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: mode === 'dark' 
                            ? 'rgba(10, 14, 26, 0.95)' 
                            : 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: mode === 'dark'
                            ? '1px solid rgba(255, 255, 255, 0.08)'
                            : '1px solid rgba(0, 0, 0, 0.08)',
                        boxShadow: mode === 'dark'
                            ? '4px 0 24px rgba(0, 0, 0, 0.3)'
                            : '4px 0 16px rgba(0, 0, 0, 0.1)',
                    }
                }
            },
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        border: 'none',
                        '& .MuiDataGrid-columnHeader': {
                            backgroundColor: mode === 'dark'
                                ? `${currentColors.primary}15`
                                : `${currentColors.primary}08`,
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-row': {
                            transition: 'all 0.2s ease',
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: mode === 'dark'
                                ? `${currentColors.primary}20`
                                : `${currentColors.primary}10`,
                        },
                    }
                }
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 20,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: mode === 'dark'
                                ? '0 12px 40px rgba(0, 0, 0, 0.5)'
                                : '0 8px 24px rgba(0, 0, 0, 0.15)',
                        },
                    }
                }
            },
        }
    });

    const toggleMode = () => {
        setMode(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const value = {
        mode,
        colorScheme,
        toggleMode,
        setColorScheme,
        currentColors,
    };

    return (
        <ThemeContext.Provider value={value}>
            <MuiThemeProvider theme={theme}>
                <Box
                    sx={{
                        minHeight: '100vh',
                        background: mode === 'dark'
                            ? 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 50%, #0a0e1a 100%)'
                            : 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 50%, #f9fafb 100%)',
                        transition: 'background 0.5s ease',
                    }}
                >
                    {children}

                    <Box
                        sx={{
                            position: 'fixed',
                            bottom: 24,
                            right: 24,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            zIndex: 1000,
                        }}
                    >
                        <Tooltip title={`Schimbă în tema ${mode === 'dark' ? 'light' : 'dark'}`} placement="left">
                            <IconButton
                                onClick={toggleMode}
                                sx={{
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    '&:hover': {
                                        bgcolor: 'background.paper',
                                        transform: 'scale(1.1) rotate(180deg)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Schimbă culoarea" placement="left">
                            <IconButton
                                onClick={() => setShowPalette(!showPalette)}
                                sx={{
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    '&:hover': {
                                        bgcolor: 'background.paper',
                                        transform: 'scale(1.1)',
                                    },
                                }}
                            >
                                <PaletteIcon sx={{ color: currentColors.primary }} />
                            </IconButton>
                        </Tooltip>

                        <AnimatePresence>
                            {showPalette && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Box
                                        sx={{
                                            bgcolor: 'background.paper',
                                            borderRadius: 3,
                                            p: 2,
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1,
                                            minWidth: 200,
                                        }}
                                    >
                                        <Box sx={{ mb: 1 }}>
                                            <Box sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                                                Schemă de Culori
                                            </Box>
                                        </Box>
                                        {Object.entries(themes[mode]).map(([key, colors]) => (
                                            <Box
                                                key={key}
                                                onClick={() => {
                                                    setColorScheme(key);
                                                    setShowPalette(false);
                                                }}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    border: colorScheme === key ? `2px solid ${colors.primary}` : '2px solid transparent',
                                                    bgcolor: colorScheme === key ? `${colors.primary}15` : 'transparent',
                                                    '&:hover': {
                                                        bgcolor: `${colors.primary}10`,
                                                    },
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: 1.5,
                                                        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                                        boxShadow: `0 4px 12px ${colors.primary}40`,
                                                    }}
                                                />
                                                <Box sx={{ fontSize: 13, fontWeight: 500 }}>
                                                    {colors.name}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>
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