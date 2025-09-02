import {useApp} from "@app/hooks/params/useApp.ts";
import type {IPermissionContext} from "@app/contexts/params/types.ts";
import {useMemo} from "react";
import type {TPermission} from "@/api/models/Permissions.interface.ts";

export const usePermissions = (): IPermissionContext => {
    const { user, isAuthenticated } = useApp();

    const userPermissions = useMemo(() => {
        if (!user || !isAuthenticated) return [];

        const directPermissions = user.permissions || [];
        const rolePermissions = user.roles?.flatMap(role => role.permissions) || [];

        return [...new Set([...directPermissions, ...rolePermissions])];
    }, [user, isAuthenticated]);

    const userRoles = useMemo(() => {
        if (!user || !isAuthenticated) return [];
        return user.roles?.flatMap(role => role.name) || [];
    }, [user, isAuthenticated]);

    const hasPermission = (permission: TPermission) => {
        if (!user || !isAuthenticated) return false;
        return userPermissions.includes(permission);
    }

    const hasRole = (roleName: string) => {
        if (!user || !isAuthenticated) return false;
        return userRoles?.includes(roleName);
    }

    const hasAnyRole = (rolesNames: string[]) => {
        if (!user || !isAuthenticated) return false;
        return rolesNames.some(roleName => userRoles.includes(roleName));
    }

    const hasAllRoles = (roleNames: string[]) => {
        if (!user || !isAuthenticated) return false;
        return roleNames.every(roleName => userRoles.includes(roleName));
    }

    const hasAnyPermission = (permissions: TPermission[]) => {
        if (!user || !isAuthenticated) return false;
        return permissions.some(permission => userPermissions.includes(permission));
    }

    const hasAllPermissions = (permissions: TPermission[]) => {
        if (!user || !isAuthenticated) return false;
        return permissions.every(permission => userPermissions.includes(permission));
    }

    const canAccessRoute = (requiredRoles?: string[], requiredPermissions?: TPermission[]) => {
        if (!user || !isAuthenticated) return false;

        if (!requiredRoles?.length && !requiredPermissions?.length) return true;

        const hasRequiredRoles = !requiredRoles?.length || hasAnyRole(requiredRoles);

        const hasRequiredPermissions = !requiredPermissions?.length || hasAnyPermission(requiredPermissions);

        return hasRequiredRoles && hasRequiredPermissions;
    }

    return {
        hasPermission,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        hasAnyPermission,
        hasAllPermissions,
        canAccessRoute
    };
}