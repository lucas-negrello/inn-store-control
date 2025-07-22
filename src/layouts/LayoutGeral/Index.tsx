import {Box, Container, type SxProps} from '@mui/material'
import * as React from "react";
import type {ReactElement} from "react";
import {Outlet} from "react-router-dom";
import MainHeader from "@/layouts/LayoutGeral/MainHeader";
import MainFooter from "@/layouts/LayoutGeral/MainFooter.tsx";
import {Sidebar} from "@/shared/Layout/Menu.tsx";

const bodyStyles: SxProps = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
};

const mainStyles: SxProps = {
    flex: 1,
    mt: 4
};

export default function LayoutGeral(): ReactElement {

    return (
        <Box sx={bodyStyles}>
            <MainHeader />
            <Sidebar />

            <Container component="main" sx={mainStyles}>
                <Outlet />
            </Container>

            <MainFooter />
        </Box>
    )
}