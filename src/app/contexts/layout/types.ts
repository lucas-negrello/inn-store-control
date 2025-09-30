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

export interface IMessageContext {
    open: boolean;
    setOpen: (open: boolean) => void;
    message: string;
    setMessage: (message: string) => void;
    severity: 'error' | 'warning' | 'info' | 'success';
    setSeverity: (severity: 'error' | 'warning' | 'info' | 'success') => void;
    timer?: number;
    setTimer?: (timer: number) => void;
}