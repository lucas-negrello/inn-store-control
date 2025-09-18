import React from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {useAccountPage} from "@/pages/private/account/AccountPageHook.tsx";

export default function AccountPage() {
    const { user } = useAccountPage();

    if (!user) {
        return (
            <Container maxWidth="md">
                <Typography variant="h4">Usuário não encontrado</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 80, height: 80, mr: 3, fontSize: '2rem' }}>
                        {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Minha Conta
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {user.username}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container columnSpacing={3} rowSpacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h6" gutterBottom>
                            Informações Pessoais
                        </Typography>
                        <List>
                            <ListItem disablePadding>
                                <ListItemText primary="Nome de usuário" secondary={user.username} />
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="Email" secondary={user.email} />
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText
                                    primary="Status"
                                    secondary={
                                        <Chip
                                            component="span"
                                            label={user.isActive ? 'Ativo' : 'Inativo'}
                                            color={user.isActive ? 'success' : 'error'}
                                            size="small"
                                        />
                                    }
                                />
                            </ListItem>
                        </List>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h6" gutterBottom>
                            Permissões e Roles
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Roles:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {user.roles && user.roles.length > 0 ? (
                                    user.roles.map((role) => (
                                        <Chip
                                            key={role.id}
                                            label={role.name}
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Nenhuma role atribuída
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Permissões Diretas:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {user.permissions && user.permissions.length > 0 ? (
                                    user.permissions.map((permission) => (
                                        <Chip
                                            key={permission.id}
                                            label={permission.key}
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Nenhuma permissão direta
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}