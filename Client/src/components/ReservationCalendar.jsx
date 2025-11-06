import React, { useState, useMemo } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    IconButton, 
    Chip,
    Tooltip,
    Button
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';

function ReservationCalendar({ reservations }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthNames = [
        'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
        'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ];

    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        return new Date(year, month + 1, 0).getDate();
    }, [currentDate]);

    const firstDayOfMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    }, [currentDate]);

    const days = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'];

    const getReservationsForDay = (day) => {
        const dateToCheck = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );
        dateToCheck.setHours(0, 0, 0, 0);

        return reservations.filter(reservation => {
            const start = new Date(reservation.startDate);
            start.setHours(0, 0, 0, 0); 
            
            const end = new Date(reservation.endDate);
            end.setHours(0, 0, 0, 0);

            return dateToCheck >= start && dateToCheck < end;
        });
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const today = new Date();
    const isToday = (day) => {
        return day === today.getDate() &&
               currentDate.getMonth() === today.getMonth() &&
               currentDate.getFullYear() === today.getFullYear();
    };

    return (
        <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={prevMonth} color="primary">
                        <ChevronLeftIcon />
                    </IconButton>
                    <Typography variant="h5" fontWeight="bold" sx={{ minWidth: 200, textAlign: 'center' }}>
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </Typography>
                    <IconButton onClick={nextMonth} color="primary">
                        <ChevronRightIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setCurrentDate(new Date())}
                    >
                        Azi
                    </Button>
                </Box>
            </Box>

            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: 1,
                mb: 1
            }}>
                {days.map(day => (
                    <Box 
                        key={day}
                        sx={{ 
                            p: 1, 
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: 'primary.main'
                        }}
                    >
                        {day}
                    </Box>
                ))}
            </Box>

            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: 1
            }}>
                {[...Array(firstDayOfMonth)].map((_, index) => (
                    <Box key={`empty-${index}`} />
                ))}

                {[...Array(daysInMonth)].map((_, index) => {
                    const day = index + 1;
                    const dayReservations = getReservationsForDay(day);
                    const isCurrentDay = isToday(day);

                    return (
                        <motion.div
                            key={day}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.01 }}
                        >
                            <Tooltip
                                title={
                                    dayReservations.length > 0
                                        ? dayReservations.map(r => r.guestName).join(', ')
                                        : 'Fără rezervări'
                                }
                                arrow
                            >
                                <Paper
                                    elevation={isCurrentDay ? 8 : 1}
                                    sx={{
                                        p: 1,
                                        minHeight: 80,
                                        cursor: dayReservations.length > 0 ? 'pointer' : 'default',
                                        background: isCurrentDay 
                                            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                                            : dayReservations.length > 0
                                            ? 'rgba(16, 185, 129, 0.1)'
                                            : 'rgba(15, 23, 42, 0.5)',
                                        border: isCurrentDay 
                                            ? '2px solid #3b82f6'
                                            : '1px solid rgba(255, 255, 255, 0.05)',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: dayReservations.length > 0 ? 'scale(1.05)' : 'none',
                                            boxShadow: dayReservations.length > 0 ? '0 8px 24px rgba(59, 130, 246, 0.3)' : 'none'
                                        }
                                    }}
                                >
                                    <Typography 
                                        variant="body2" 
                                        fontWeight={isCurrentDay ? 'bold' : 'normal'}
                                        color={isCurrentDay ? 'primary.main' : 'text.primary'}
                                        sx={{ mb: 0.5 }}
                                    >
                                        {day}
                                    </Typography>
                                    {dayReservations.length > 0 && (
                                        <Chip
                                            label={dayReservations.length}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.7rem',
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    )}
                                </Paper>
                            </Tooltip>
                        </motion.div>
                    );
                })}
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: 1,
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                        border: '2px solid #3b82f6'
                    }} />
                    <Typography variant="caption">Astăzi</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: 1,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    }} />
                    <Typography variant="caption">Cu Rezervări</Typography>
                </Box>
            </Box>
        </Paper>
    );
}

export default ReservationCalendar;