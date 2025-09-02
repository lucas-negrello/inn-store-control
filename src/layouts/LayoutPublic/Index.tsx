import {Box, Container, type SxProps} from '@mui/material'
import  {type ReactElement} from "react";
import {Outlet} from "react-router-dom";
import * as React from "react";
import MainHeader from "@/shared/Layout/Header/MainHeader.tsx";
import MainFooter from "@/shared/Layout/Footer/MainFooter.tsx";

const bodyStyles: SxProps = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
};

const mainStyles: SxProps = {
    flex: 1,
    mt: 4
};

export default function LayoutPublic(): ReactElement {
    return (
        <Box sx={bodyStyles}>
            <MainHeader showMenuButton={false} />

            <Container component="main" sx={mainStyles}>
                <Outlet />
            </Container>

            <MainFooter />
        </Box>
    );
}
