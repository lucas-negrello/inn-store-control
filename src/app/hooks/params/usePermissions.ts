import {useContext} from "react";
import {PermissionsContext} from "@app/contexts/params/PermissionsContext.tsx";

export const usePermissions = () => {
    const context = useContext(PermissionsContext);
    if (!context) throw new Error('usePermissions must be used within a PermissionProvider');
    return context;
}