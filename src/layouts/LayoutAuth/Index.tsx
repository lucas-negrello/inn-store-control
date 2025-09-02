import {Box, Container, type SxProps} from "@mui/material";
import {Outlet} from "react-router-dom";
import type {ReactElement} from "react";
import {DebugInfo} from "@/utils/debug/DebugInfo.tsx";

const bodyStyles: SxProps = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
};

const cardStyles: SxProps = {
    minHeight: '80vh',
    minWidth: '80vw'
}

export default function(): ReactElement {
    return (
        <Box sx={bodyStyles}>
            <Container component='main'>
                <Box sx={cardStyles}>
                    <Outlet />
                </Box>
            </Container>
            <DebugInfo />
        </Box>
    );
}