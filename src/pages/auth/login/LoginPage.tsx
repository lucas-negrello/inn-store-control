import React from 'react';
import { Avatar, Box, Container, Paper, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginForm from "@/pages/auth/login/LoginForm.tsx";
import type {ILoginCredentials} from "@/api/models/Auth.interface.ts";

type Props = {
    onSubmit: (credentials: ILoginCredentials) => void;
    loading: boolean;
    error?: string | null;
};

export default function LoginPage({ onSubmit, loading, error }: Props) {
    return (
        <Container maxWidth="sm" sx={{ display: "grid", placeItems: "center", minHeight: "80svh" }}>
            <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
                <Box sx={{ display: 'grid', placeItems: 'center', gap: 1, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <LoginForm onSubmit={onSubmit} loading={loading} error={error} />
                </Box>
            </Paper>
        </Container>
    );
}