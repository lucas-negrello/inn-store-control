import {useContext} from "react";
import {ThemeContext} from "@app/contexts/theme/ThemeContext";
import type {IThemeContext} from "@app/contexts/theme/types.ts";

export const useThemeMode: () => IThemeContext =
    (): IThemeContext =>
        useContext(ThemeContext);