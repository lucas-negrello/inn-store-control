export type TTheme = "light" | "dark";

export interface IThemeContext {
    themeMode: TTheme;
    toggleTheme: () => void;
}