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
    Divider,
    IconButton,
    Collapse
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import ReplyIcon from '@mui/icons-material/Reply';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
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
    const [respondingTo, setRespondingTo] = useState(null);
    const [responseText, setResponseText] = useState('');
    const auth = useAuth();
    const { showToast } = useToast();

    const isGuest = auth.user?.role === 'ROLE_GUEST';
    const isStaff = auth.user?.role === 'ROLE_Admin' || auth.user?.role === 'ROLE_Manager';

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

    const handleRespondToReview = async (reviewId) => {
        if (responseText.trim().length < 10) {
            showToast('Răspunsul trebuie să aibă minim 10 caractere', 'error');
            return;
        }

        try {
            await axios.post(
                `http://localhost:8080/api/staff/reviews/${reviewId}/respond`,
                { response: responseText },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            showToast('Răspuns trimis cu succes!', 'success');
            setRespondingTo(null);
            setResponseText('');
            fetchReviews();
        } catch (error) {
            showToast('Eroare la trimiterea răspunsului', 'error');
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
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {review.comment}
                                        </Typography>

                                        {review.staffResponse && (
                                            <Box
                                                sx={{
                                                    mt: 2,
                                                    p: 2,
                                                    borderRadius: 2,
                                                    background: 'rgba(59, 130, 246, 0.1)',
                                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                                                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                                                        <SupportAgentIcon sx={{ fontSize: 16 }} />
                                                    </Avatar>
                                                    <Typography variant="caption" fontWeight="bold" color="primary">
                                                        Răspuns Staff
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        • {formatDate(review.respondedAt)}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4.5 }}>
                                                    {review.staffResponse}
                                                </Typography>
                                            </Box>
                                        )}

                                        {isStaff && !review.staffResponse && (
                                            <Box sx={{ mt: 2 }}>
                                                {respondingTo === review.id ? (
                                                    <Box>
                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            rows={3}
                                                            placeholder="Scrie răspunsul tău aici..."
                                                            value={responseText}
                                                            onChange={(e) => setResponseText(e.target.value)}
                                                            sx={{ mb: 1 }}
                                                        />
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                            <Button
                                                                size="small"
                                                                onClick={() => {
                                                                    setRespondingTo(null);
                                                                    setResponseText('');
                                                                }}
                                                            >
                                                                Anulează
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={() => handleRespondToReview(review.id)}
                                                                disabled={responseText.trim().length < 10}
                                                            >
                                                                Trimite Răspuns
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <Button
                                                        size="small"
                                                        startIcon={<ReplyIcon />}
                                                        onClick={() => setRespondingTo(review.id)}
                                                        sx={{ color: 'primary.main' }}
                                                    >
                                                        Răspunde
                                                    </Button>
                                                )}
                                            </Box>
                                        )}
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