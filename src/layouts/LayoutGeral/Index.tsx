import {Box, Container, type SxProps} from '@mui/material'
import * as React from "react";
import type {ReactElement} from "react";
import MainHeader from "@/layouts/LayoutGeral/MainHeader";
import MainFooter from "@/layouts/LayoutGeral/MainFooter.tsx";

const bodyStyles: SxProps = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
};

const mainStyles: SxProps = {
    flex: 1,
    mt: 4
};

export default function LayoutGeral({children}: { children: React.ReactNode }): ReactElement {

    return (
        <Box sx={bodyStyles}>
            <MainHeader />

            <Container component="main" sx={mainStyles}>
                {children}
            </Container>

            <MainFooter />
        </Box>
    )
}