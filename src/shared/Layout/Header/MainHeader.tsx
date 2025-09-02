import {AccountCircleRounded, DarkModeRounded, LightModeRounded, Menu} from "@mui/icons-material";
import {AppBar, Box, type SxProps, Toolbar} from "@mui/material";
import * as React from "react";
import {useThemeMode} from "@app/hooks/layout/useThemeMode.ts";
import {CustomIconButton} from "@/shared/Button/IconButton/IconButton.tsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import logo from '@assets/images/logo.png';
import {useLayout} from "@app/hooks/layout/useLayout.ts";
import {useNavigate} from "react-router-dom";

const appBarStyles: SxProps = {
    bgcolor: 'background.paper',
    position: 'sticky'
}

const toolbarStyles: SxProps = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
}

const logoStyles: SxProps = {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '& img': {
        height: '100%',
        width: 'auto'
    }
}

type Props = {
    showMenuButton?: boolean;
    onLogoClickRoute?: string;
};

export default function MainHeader({ showMenuButton, onLogoClickRoute }: Props) {
    const {themeMode, toggleTheme} = useThemeMode();
    const {toggleSidebar} = useLayout();
    const navigate = useNavigate();

    const isLight = themeMode === "light";
    const Icon = isLight ? DarkModeRounded : LightModeRounded;

    const handleLogoClick = () => {
        navigate(onLogoClickRoute || '/');
    };

    return (
        <AppBar sx={appBarStyles}>
            <Toolbar sx={toolbarStyles}>
                {
                    showMenuButton ?
                        <Box>
                            <CustomIconButton icon={Menu} color='primary' onClick={toggleSidebar} />
                        </Box>
                        :
                        <Box sx={{ width: 40 }} />
                }
                <Box
                    component="img"
                    src={logo}
                    alt="Microondas Caxias"
                    onClick={handleLogoClick}
                    sx={logoStyles} />
                <Box>
                    <CustomIconButton icon={Icon} color='primary' onClick={toggleTheme} />
                    <CustomIconButton icon={AccountCircleRounded} color='primary' />
                </Box>
            </Toolbar>
        </AppBar>
    );
}