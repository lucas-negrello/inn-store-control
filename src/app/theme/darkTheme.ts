import * as plt from "./palletes.ts";
import type {Theme} from "@emotion/react";
import {createTheme} from "@mui/material/styles";

export const darkTheme: Theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: plt.primaryPallete[300],
            light: plt.primaryPallete[200],
            dark: plt.primaryPallete[500],
            contrastText: plt.blackPallete[950],
        },
        secondary: {
            main: plt.secondaryPallete[300],
            light: plt.secondaryPallete[200],
            dark: plt.secondaryPallete[500],
            contrastText: plt.blackPallete[950],
        },
        background: {
            default: plt.blackPallete[900],
            paper: plt.blackPallete[800],
        },
        text: {
            primary: plt.whitePallete[50],
            secondary: plt.grayPallete[300],
            disabled: plt.grayPallete[500],
        },
        divider: plt.grayPallete[700],
        error: {
            main: '#ef5350',
            light: '#e57373',
            dark: '#c62828',
            contrastText: plt.whitePallete[50],
        },
        warning: {
            main: '#ffb74d',
            light: '#ffe082',
            dark: '#f57c00',
            contrastText: plt.blackPallete[950],
        },
        info: {
            main: '#4fc3f7',
            light: '#81d4fa',
            dark: '#0288d1',
            contrastText: plt.blackPallete[950],
        },
        success: {
            main: '#81c784',
            light: '#a5d6a7',
            dark: '#388e3c',
            contrastText: plt.blackPallete[950],
        },
        action: {
            active: plt.grayPallete[200],
            hover: plt.grayPallete[800],
            selected: plt.grayPallete[700],
            disabled: plt.grayPallete[600],
            disabledBackground: plt.grayPallete[800],
            focus: plt.grayPallete[700],
        },
    },
});