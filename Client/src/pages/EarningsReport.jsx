import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

function EarningsReport() {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = useAuth();

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/reports/weekly-earnings', {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                setReportData(response.data);
            } catch (error) {
                console.error("Eroare la preluarea raportului:", error);
            } finally {
                setLoading(false);
            }
        };
        if (auth.token) fetchReport();
    }, [auth.token]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    const totalEarnings = reportData.reduce((acc, day) => acc + day['Încasări'], 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
        >
            <Paper 
                sx={{ 
                    p: 4, 
                    height: 550,
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)',
                    border: '1.5px solid rgba(16, 185, 129, 0.25)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Box>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                📈 Raport Încasări Săptămânale
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Activitatea financiară din ultima săptămână
                            </Typography>
                        </Box>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Chip 
                            icon={<AttachMoneyIcon />}
                            label={`Total: ${totalEarnings.toFixed(2)} RON`} 
                            sx={{ 
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                px: 2,
                                py: 2.5,
                                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                            }}
                        />
                    </motion.div>
                </Box>
                <ResponsiveContainer width="100%" height="85%">
                    <BarChart
                        data={reportData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                                <stop offset="95%" stopColor="#059669" stopOpacity={0.6}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                        <XAxis 
                            dataKey="name" 
                            stroke="#9ca3af" 
                            tick={{ fill: '#9ca3af' }}
                            axisLine={{ stroke: '#334155' }}
                        />
                        <YAxis 
                            stroke="#9ca3af" 
                            tick={{ fill: '#9ca3af' }}
                            axisLine={{ stroke: '#334155' }}
                            unit=" RON"
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                            }}
                            itemStyle={{ color: '#e5e7eb', fontWeight: 'bold' }}
                            labelStyle={{ color: '#9ca3af', marginBottom: '8px' }}
                            formatter={(value) => `${value.toFixed(2)} RON`}
                        />
                        <Legend />
                        <Bar 
                            dataKey="Încasări" 
                            fill="url(#colorEarnings)" 
                            radius={[8, 8, 0, 0]}
                            animationDuration={1000}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </motion.div>
    );
}

export default EarningsReport;