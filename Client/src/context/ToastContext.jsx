import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'info' // 'success', 'error', 'warning', 'info'
    });

    const showToast = useCallback((message, severity = 'info') => {
        setToast({ open: true, message, severity });
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, open: false }));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={hideToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={hideToast} 
                    severity={toast.severity}
                    variant="filled"
                    sx={{ 
                        width: '100%',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

// Usage in components:
// const { showToast } = useToast();
// showToast('Rezervarea a fost creată cu succes!', 'success');
// showToast('Eroare la salvare', 'error');