import type {FC} from "react";
import type {IPermissionGuardProps} from "@app/providers/guards/types.ts";
import {usePermissions} from "@app/hooks/params/usePermissions.ts";

export const PermissionGuardProvider: FC<IPermissionGuardProps> = ({
    children,
    roles = [],
    permissions = [],
    requireAll = false,
    fallback = null
}) => {
    const { hasAllRoles, hasAllPermissions, canAccessRoute } = usePermissions();

    const hasAccess = (): boolean => {
        if (!roles.length && !permissions.length) return true;

        if (requireAll) {
            const hasRequiredRoles = !roles.length || hasAllRoles(roles);
            const hasRequiredPermissions = !permissions.length || hasAllPermissions(permissions);
            return hasRequiredRoles && hasRequiredPermissions;
        } else {
            return canAccessRoute(roles, permissions);
        }
    };

    if (!hasAccess()) {
        return <>{fallback}</>
    }

    return <>{children}</>
}