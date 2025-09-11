import React, {type FC} from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useApp } from '@app/hooks/params/useApp';
import {usePermissions} from "@app/hooks/params/usePermissions.ts";

export const DebugInfo: FC = () => {
    const { user, isAuthenticated, isLoading } = useApp();
    const { hasRole, hasPermission } = usePermissions();

    if (process.env.NODE_ENV === 'production') return null;

    return (
        <Box sx={{ position: 'fixed', bottom: 10, right: 10, zIndex: 9999 }}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="caption">Debug Info</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ minWidth: 300 }}>
                        <Typography variant="body2">
                            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>User ID:</strong> {user?.id || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Username:</strong> {user?.username || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Roles:</strong> {user?.roles?.map(r => r.name).join(', ') || 'None'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Permissions:</strong> {user?.permissions?.flatMap(p => p.key).join(', ') || 'None'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Has Admin Role:</strong> {hasRole('admin') ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Has All Permission:</strong> {hasPermission('all') ? 'Yes' : 'No'}
                        </Typography>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};