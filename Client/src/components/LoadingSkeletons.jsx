import React from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

export function TableSkeleton({ rows = 5 }) {
    return (
        <Box sx={{ width: '100%' }}>
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 2 }} />
            {[...Array(rows)].map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Skeleton 
                        variant="rectangular" 
                        height={52} 
                        sx={{ mb: 1, borderRadius: 1 }} 
                    />
                </motion.div>
            ))}
        </Box>
    );
}

export function DashboardCardSkeleton() {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Skeleton variant="rounded" width={60} height={24} />
                </Box>
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={40} />
            </CardContent>
        </Card>
    );
}

export function ChartSkeleton() {
    return (
        <Box sx={{ p: 4, height: 500 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                    <Skeleton variant="text" width={200} height={32} />
                    <Skeleton variant="text" width={150} height={20} />
                </Box>
                <Skeleton variant="rounded" width={120} height={32} />
            </Box>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Box>
    );
}