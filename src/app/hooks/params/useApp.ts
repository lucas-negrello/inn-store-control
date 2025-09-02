import {useContext} from "react";
import {AppContext} from "@app/contexts/params/AppContext.tsx";

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within a AppProvider');
    return context;
}