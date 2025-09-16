import {Box, Container, Paper, Typography} from "@mui/material";
import RegisterForm from "@/pages/auth/register/RegisterForm.tsx";
import React from "react";

type Props = {
    loading?: boolean;
    error?: string | null;
}

export default function RegisterPage({ loading, error }: Props) {
    return (
        <Container maxWidth="sm" sx={{ display: "grid", placeItems: "center", minHeight: "80svh" }}>
            <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
                <Box sx={{ display: 'grid', placeItems: 'center', gap: 1, mb: 2 }}>
                    <Typography component="h1" variant="h5">
                        Registrar
                    </Typography>
                    <RegisterForm />
                </Box>
            </Paper>
        </Container>
    )
}