import {useContext} from "react";
import {AdminPageContext} from "@/pages/private/admin/AdminPageContext.tsx";

export const useAdminPage = () => {
    const context = useContext(AdminPageContext);
    if (!context) throw new Error('useAdminPage must be used within a AdminPageProvider');
    return context;
}