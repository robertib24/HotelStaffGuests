import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Rating, 
    Avatar, 
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function RoomReviews({ roomId }) {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [modalOpen, setModalOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const auth = useAuth();
    const { showToast } = useToast();

    const isGuest = auth.user?.role === 'ROLE_GUEST';

    useEffect(() => {
        fetchReviews();
        fetchStats();
    }, [roomId]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reviews/room/${roomId}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Eroare la preluarea review-urilor:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reviews/room/${roomId}/stats`);
            setStats(response.data);
        } catch (error) {
            console.error('Eroare la preluarea statisticilor:', error);
        }
    };

    const handleSubmitReview = async () => {
        if (comment.trim().length < 10) {
            showToast('Comentariul trebuie să aibă minim 10 caractere', 'error');
            return;
        }

        try {
            await axios.post(
                'http://localhost:8080/api/client/reviews',
                { roomId, rating, comment },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            showToast('Review adăugat cu succes!', 'success');
            setModalOpen(false);
            setRating(5);
            setComment('');
            fetchReviews();
            fetchStats();
        } catch (error) {
            showToast('Eroare la adăugarea review-ului', 'error');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ro-RO', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box>
            <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                            ⭐ Recenzii Cameră
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Rating value={stats.averageRating} precision={0.1} readOnly />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {stats.averageRating.toFixed(1)}
                            </Typography>
                            <Chip 
                                label={`${stats.totalReviews} recenzii`}
                                size="small"
                                color="primary"
                            />
                        </Box>
                    </Box>
                    {isGuest && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setModalOpen(true)}
                            sx={{
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
                            }}
                        >
                            Adaugă Recenzie
                        </Button>
                    )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                {loading ? (
                    <Typography>Se încarcă recenziile...</Typography>
                ) : reviews.length === 0 ? (
                    <Typography color="text.secondary">
                        Nicio recenzie încă. Fii primul care adaugă o recenzie!
                    </Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <AnimatePresence>
                            {reviews.map((review, index) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Paper
                                        sx={{
                                            p: 3,
                                            background: 'rgba(15, 23, 42, 0.6)',
                                            borderRadius: 2,
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <PersonIcon />
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {review.guestName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(review.createdAt)}
                                                </Typography>
                                            </Box>
                                            <Rating value={review.rating} readOnly size="small" />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {review.comment}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </Box>
                )}
            </Paper>

            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Adaugă Recenzie
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Rating
                            </Typography>
                            <Rating
                                value={rating}
                                onChange={(_, newValue) => setRating(newValue)}
                                size="large"
                                icon={<StarIcon fontSize="inherit" />}
                            />
                        </Box>
                        <TextField
                            label="Comentariu"
                            multiline
                            rows={4}
                            fullWidth
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            helperText={`${comment.length}/1000 caractere (minim 10)`}
                            inputProps={{ maxLength: 1000 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setModalOpen(false)} variant="outlined" color="inherit">
                        Anulează
                    </Button>
                    <Button onClick={handleSubmitReview} variant="contained">
                        Trimite Recenzie
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default RoomReviews;