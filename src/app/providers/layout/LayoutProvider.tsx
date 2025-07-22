import {useCallback, useState} from "react";
import type {ILayoutProps} from "@app/providers/layout/types.ts";
import { LayoutContext } from "@/app/contexts/layout/LayoutContext";

export const LayoutProvider = ({children}: ILayoutProps) => {
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    return (
        <LayoutContext.Provider value={{isSidebarOpen, toggleSidebar, closeSidebar}}>
            {children}
        </LayoutContext.Provider>
    );
};