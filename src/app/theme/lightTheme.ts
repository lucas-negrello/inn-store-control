import * as plt from "./palletes.ts";
import type {Theme} from "@emotion/react";
import {createTheme} from "@mui/material/styles";

export const lightTheme: Theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: plt.primaryPallete[500],
            light: plt.primaryPallete[300],
            dark: plt.primaryPallete[700],
            contrastText: plt.whitePallete[50],
        },
        secondary: {
            main: plt.secondaryPallete[500],
            light: plt.secondaryPallete[300],
            dark: plt.secondaryPallete[700],
            contrastText: plt.whitePallete[50],
        },
        background: {
            default: plt.whitePallete[100],
            paper: plt.whitePallete[50],
        },
        text: {
            primary: plt.blackPallete[900],
            secondary: plt.grayPallete[700],
            disabled: plt.grayPallete[400],
        },
        divider: plt.grayPallete[200],
        error: {
            main: '#f44336',
            light: '#e57373',
            dark: '#d32f2f',
            contrastText: plt.whitePallete[50],
        },
        warning: {
            main: '#ffa726',
            light: '#ffb74d',
            dark: '#f57c00',
            contrastText: plt.blackPallete[950],
        },
        info: {
            main: '#29b6f6',
            light: '#4fc3f7',
            dark: '#0288d1',
            contrastText: plt.whitePallete[50],
        },
        success: {
            main: '#66bb6a',
            light: '#81c784',
            dark: '#388e3c',
            contrastText: plt.whitePallete[50],
        },
        action: {
            active: plt.grayPallete[800],
            hover: plt.grayPallete[100],
            selected: plt.grayPallete[200],
            disabled: plt.grayPallete[300],
            disabledBackground: plt.grayPallete[100],
            focus: plt.grayPallete[200],
        },
    },
});