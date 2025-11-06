import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleReset = () => {
        this.setState({ 
            hasError: false,
            error: null,
            errorInfo: null
        });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 50%, #0a0e1a 100%)',
                        p: 3
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper
                            sx={{
                                p: 6,
                                maxWidth: 600,
                                textAlign: 'center',
                                borderRadius: 4,
                                background: 'rgba(15, 23, 42, 0.8)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: 360 }}
                                transition={{ duration: 0.6, type: "spring" }}
                            >
                                <Box
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 24px',
                                        boxShadow: '0 12px 40px rgba(239, 68, 68, 0.4)',
                                    }}
                                >
                                    <ErrorOutlineIcon sx={{ fontSize: 56, color: 'white' }} />
                                </Box>
                            </motion.div>

                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Oops! Ceva nu a mers bine
                            </Typography>

                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                A apărut o eroare neașteptată. Te rugăm să reîncarci pagina sau să încerci mai târziu.
                            </Typography>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <Box
                                    sx={{
                                        mb: 3,
                                        p: 2,
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        borderRadius: 2,
                                        textAlign: 'left',
                                        maxHeight: 200,
                                        overflow: 'auto',
                                        fontFamily: 'monospace',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <Typography variant="caption" color="error">
                                        {this.state.error.toString()}
                                    </Typography>
                                </Box>
                            )}

                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<RefreshIcon />}
                                onClick={this.handleReset}
                                sx={{
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 32px rgba(239, 68, 68, 0.5)',
                                    }
                                }}
                            >
                                Reîncarcă Aplicația
                            </Button>
                        </Paper>
                    </motion.div>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

// Usage in main.jsx:
// import ErrorBoundary from './components/ErrorBoundary';
// 
// <ErrorBoundary>
//     <App />
// </ErrorBoundary>