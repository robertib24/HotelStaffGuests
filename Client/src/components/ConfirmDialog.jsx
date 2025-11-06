import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { motion } from 'framer-motion';

function ConfirmDialog({ 
    open, 
    onClose, 
    onConfirm, 
    title = 'Confirmă acțiunea',
    message = 'Ești sigur că vrei să continui?',
    confirmText = 'Confirmă',
    cancelText = 'Anulează',
    severity = 'warning' // 'warning', 'error', 'info'
}) {
    const getSeverityColor = () => {
        switch (severity) {
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            case 'info': return '#3b82f6';
            default: return '#f59e0b';
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'visible'
                }
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    pt: 4,
                    pb: 2
                }}>
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: `${getSeverityColor()}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2
                        }}
                    >
                        <WarningAmberIcon 
                            sx={{ 
                                fontSize: 36, 
                                color: getSeverityColor() 
                            }} 
                        />
                    </Box>
                    <DialogTitle sx={{ 
                        fontWeight: 'bold', 
                        textAlign: 'center',
                        pb: 1
                    }}>
                        {title}
                    </DialogTitle>
                </Box>
                <DialogContent>
                    <Typography 
                        variant="body1" 
                        color="text.secondary"
                        textAlign="center"
                    >
                        {message}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
                    <Button 
                        onClick={onClose} 
                        variant="outlined" 
                        color="inherit"
                        fullWidth
                    >
                        {cancelText}
                    </Button>
                    <Button 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }} 
                        variant="contained"
                        sx={{
                            background: `linear-gradient(135deg, ${getSeverityColor()} 0%, ${getSeverityColor()}dd 100%)`,
                        }}
                        fullWidth
                    >
                        {confirmText}
                    </Button>
                </DialogActions>
            </motion.div>
        </Dialog>
    );
}

export default ConfirmDialog;

// Usage:
// const [confirmOpen, setConfirmOpen] = useState(false);
// 
// <ConfirmDialog
//     open={confirmOpen}
//     onClose={() => setConfirmOpen(false)}
//     onConfirm={() => deleteEmployee(id)}
//     title="Șterge Angajat"
//     message="Ești sigur că dorești să ștergi acest angajat? Această acțiune nu poate fi anulată."
//     confirmText="Șterge"
//     severity="error"
// />