import {Box, type SxProps, Typography} from "@mui/material";
import * as React from "react";
import type {IMainFooterProps} from "@/layouts/LayoutGeral/types.ts";

const footerStyles: SxProps = {
    p: 2,
    bgcolor: 'background.paper',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'divider',
    textAlign: 'center'
};

export default function MainFooter(props: IMainFooterProps) {
    const {date} = props;

    const year = date instanceof Date ? date.getFullYear() : date;
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={footerStyles}>
            <Typography variant="body2" color="text.secondary">
                © {year ?? currentYear} - Todos os direitos reservados.
            </Typography>
        </Box>
    )
}