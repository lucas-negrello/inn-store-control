import {Box, Container, Typography, AppBar, Toolbar, Button} from '@mui/material'
import {useThemeMode} from "@app/hooks/theme/useThemeMode.ts";
import * as React from "react";
import type {ReactElement} from "react";

export default function LayoutGeral({children}: { children: React.ReactNode }): ReactElement {
    const {themeMode, toggleTheme} = useThemeMode()

    return (
        <Box sx={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <AppBar position="static">
                <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="h6">Meu App</Typography>
                    <Button variant="outlined" color="inherit" onClick={toggleTheme}>
                        Tema: {themeMode === 'light' ? 'Claro' : 'Escuro'}
                    </Button>
                </Toolbar>
            </AppBar>

            <Container component="main" sx={{flex: 1, mt: 4}}>
                {children}
            </Container>

            <Box component="footer" sx={{p: 2, bgcolor: 'background.paper', textAlign: 'center'}}>
                <Typography variant="body2" color="text.secondary">
                    © 2025 - Meu App com MUI
                </Typography>
            </Box>
        </Box>
    )
}