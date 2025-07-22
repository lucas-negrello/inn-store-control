import {createContext, type Context} from "react";
import type {IThemeContext} from "./types.ts";

export const ThemeContext: Context<IThemeContext> = createContext({} as IThemeContext);
