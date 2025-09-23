import {Box, CircularProgress, Typography} from "@mui/material";

export const DataTableLoading = () => (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%" flexDirection="column" gap={2}>
        <CircularProgress size={32} />
        <Typography variant="body2" color="text.secondary">Carregando...</Typography>
    </Box>
);