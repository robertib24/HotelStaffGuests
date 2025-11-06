import React, { useState } from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Chip,
    Paper,
    Collapse,
    IconButton
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { motion, AnimatePresence } from 'framer-motion';

function AdvancedFilters({ filters, onFiltersChange, onClearFilters }) {
    const [expanded, setExpanded] = useState(false);

    const activeFiltersCount = Object.values(filters).filter(v => v !== '' && v !== 'all').length;

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <Button
                    variant={expanded ? 'contained' : 'outlined'}
                    startIcon={<FilterListIcon />}
                    onClick={() => setExpanded(!expanded)}
                    sx={{ position: 'relative' }}
                >
                    Filtre Avansate
                    {activeFiltersCount > 0 && (
                        <Chip
                            label={activeFiltersCount}
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                height: 20,
                                minWidth: 20,
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />
                    )}
                </Button>
                
                {activeFiltersCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Button
                            variant="text"
                            startIcon={<ClearIcon />}
                            onClick={onClearFilters}
                            color="inherit"
                        >
                            Șterge Filtre
                        </Button>
                    </motion.div>
                )}
            </Box>

            <Collapse in={expanded}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Tip Cameră</InputLabel>
                                <Select
                                    value={filters.roomType || 'all'}
                                    label="Tip Cameră"
                                    onChange={(e) => onFiltersChange({ ...filters, roomType: e.target.value })}
                                >
                                    <MenuItem value="all">Toate</MenuItem>
                                    <MenuItem value="Single">Single</MenuItem>
                                    <MenuItem value="Double">Double</MenuItem>
                                    <MenuItem value="Suite">Suite</MenuItem>
                                    <MenuItem value="Deluxe">Deluxe</MenuItem>
                                    <MenuItem value="Presidential">Presidential</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filters.status || 'all'}
                                    label="Status"
                                    onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                                >
                                    <MenuItem value="all">Toate</MenuItem>
                                    <MenuItem value="Curat">Curat</MenuItem>
                                    <MenuItem value="Necesită Curățenie">Necesită Curățenie</MenuItem>
                                    <MenuItem value="În Mentenanță">În Mentenanță</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Preț Min (RON)"
                                type="number"
                                value={filters.minPrice || ''}
                                onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
                            />

                            <TextField
                                fullWidth
                                label="Preț Max (RON)"
                                type="number"
                                value={filters.maxPrice || ''}
                                onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
                            />
                        </Box>

                        {/* Display Active Filters */}
                        <AnimatePresence>
                            {activeFiltersCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {Object.entries(filters).map(([key, value]) => {
                                                if (value && value !== 'all') {
                                                    return (
                                                        <Chip
                                                            key={key}
                                                            label={`${key}: ${value}`}
                                                            onDelete={() => onFiltersChange({ ...filters, [key]: '' })}
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    );
                                                }
                                                return null;
                                            })}
                                        </Box>
                                    </Box>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Paper>
                </motion.div>
            </Collapse>
        </Box>
    );
}

export default AdvancedFilters;