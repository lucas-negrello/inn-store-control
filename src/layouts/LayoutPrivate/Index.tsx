import {Box, Container, type SxProps} from '@mui/material'
import * as React from "react";
import type {ReactElement} from "react";
import {Outlet} from "react-router-dom";
import MainHeader from "@/shared/Layout/Header/MainHeader.tsx";
import MainFooter from "@/shared/Layout/Footer/MainFooter.tsx";
import {Sidebar} from "@/shared/Layout/Sidebar/Sidebar.tsx";
import {DebugInfo} from "@/utils/debug/DebugInfo.tsx";

const bodyStyles: SxProps = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
};

const mainStyles: SxProps = {
    flex: 1,
    mt: 4
};

type Props = {
    showMenuButton?: boolean;
};

export default function LayoutPrivate({ showMenuButton }: Props): ReactElement {
    return (
        <Box sx={bodyStyles}>
            <MainHeader showMenuButton={showMenuButton ?? false} />
            { showMenuButton ?
                <Sidebar /> :
                <></>
            }

            <Container component="main" sx={mainStyles}>
                <Outlet />
            </Container>

            <MainFooter />
            <DebugInfo />
        </Box>
    )
}