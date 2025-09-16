import {Box, Container, Paper, Typography} from "@mui/material";
import React from "react";
import ForgotPasswordForm from "@/pages/auth/forgot-password/ForgotPasswordForm.tsx";

type Props = {
    loading?: boolean;
    error?: string | null;
}

export default function ForgotPasswordPage({ loading, error }: Props) {
    return (
        <Container maxWidth="sm" sx={{ display: "grid", placeItems: "center", minHeight: "80svh" }}>
            <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
                <Box sx={{ display: 'grid', placeItems: 'center', gap: 1, mb: 2 }}>
                    <Typography component="h1" variant="h5">
                        Esqueci a Senha
                    </Typography>
                    <ForgotPasswordForm />
                </Box>
            </Paper>
        </Container>
    )
}