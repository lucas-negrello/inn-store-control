export type TTheme = "light" | "dark";

export interface IThemeContext {
    themeMode: TTheme;
    toggleTheme: () => void;
}

export interface ILayoutContext {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}