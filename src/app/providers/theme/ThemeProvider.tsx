import {useMemo, useState} from "react";
import type {IThemeProps} from "./types";
import type {TTheme} from "@/app/contexts/theme/types";
import {lightTheme} from "@/app/theme/lightTheme";
import {darkTheme} from "@/app/theme/darkTheme";
import {type Theme} from "@emotion/react";
import {ThemeProvider as MuiThemeProvider, CssBaseline} from "@mui/material";
import {ThemeContext} from "@app/contexts/theme/ThemeContext";


export const ThemeProvider = ({children}: IThemeProps) => {
    const [themeMode, setThemeMode] = useState<TTheme>("light");

    const toggleTheme = () => {
        setThemeMode((prevMode: TTheme): 'light' | 'dark' =>
            (prevMode === "light" ? "dark" : "light")
        );
    };

    const theme: Theme =
        useMemo((): Theme =>
                (themeMode === "light" ? lightTheme : darkTheme),
            [themeMode]);

    return (
        <ThemeContext.Provider value={{themeMode, toggleTheme}}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}