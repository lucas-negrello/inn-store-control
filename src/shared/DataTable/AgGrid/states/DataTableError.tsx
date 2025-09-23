import { Box, Typography, Button } from '@mui/material';
import React from 'react';

type DataTableErrorProps = {
    error: string;
    onRetry?: () => void;
}

export const DataTableError = ({ error, onRetry }: DataTableErrorProps) => (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%" flexDirection="column" gap={2} p={2}>
        <Typography variant="body2" color="error">{error}</Typography>
        {onRetry && <Button variant="outlined" size="small" onClick={onRetry}>Tentar novamente</Button>}
    </Box>
);