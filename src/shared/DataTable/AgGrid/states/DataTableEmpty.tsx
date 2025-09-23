import { Box, Typography } from '@mui/material';
import React from 'react';

type DataTableEmptyProps = {
    message?: string;
};

export const DataTableEmpty = ({ message = 'Nenhum registro encontrado.' }: DataTableEmptyProps) => (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%" flexDirection="column" gap={1} p={2}>
        <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Box>
);