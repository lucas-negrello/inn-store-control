import {AccountCircleRounded, DarkModeRounded, LightModeRounded} from "@mui/icons-material";
import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import {useThemeMode} from "@app/hooks/theme/useThemeMode.ts";
import * as React from "react";
import {CustomIconButton} from "@/shared/Button/IconButton.tsx";

export default function MainHeader() {
    const {themeMode, toggleTheme} = useThemeMode();

    const isLight = themeMode === "light";
    const Icon = isLight ? DarkModeRounded : LightModeRounded;

    return (
        <AppBar position="static">
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h6">Microondas Caxias</Typography>
                <Box>
                    <CustomIconButton icon={Icon} onClick={toggleTheme} />
                    <CustomIconButton icon={AccountCircleRounded} />
                </Box>
            </Toolbar>
        </AppBar>
    );
}