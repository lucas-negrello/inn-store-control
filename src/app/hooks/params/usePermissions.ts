import {useApp} from "@app/hooks/params/useApp.ts";
import type {IPermissionContext} from "@app/contexts/params/types.ts";
import {useCallback, useMemo} from "react";
import type {TPermission} from "@/api/models/Permissions.interface.ts";

export const usePermissions = (): IPermissionContext => {
    const { user, isAuthenticated } = useApp();

    const userPermissions = useMemo(() => {
        if (!user || !isAuthenticated) return [];

        try {
            const directPermissions = user.permissions || [];
            const rolePermissions = user.roles?.flatMap(role => role.permissions || []) || [];

            return [...new Set([...directPermissions, ...rolePermissions])];
        } catch (error) {
            console.error('Erro ao Processar permissões do usuário:', error);
            return [];
        }
    }, [user, isAuthenticated]);

    const userRoles = useMemo(() => {
        if (!user || !isAuthenticated) return [];

        try {
            return user.roles?.flatMap(role => role.name) || [];
        } catch (error) {
            console.error('Erro ao Processar regras do usuário:', error);
            return [];
        }
    }, [user, isAuthenticated]);

    const hasPermission = useCallback((permission: TPermission) => {
        if (!user || !isAuthenticated) return false;
        return userPermissions.includes(permission);
    }, [isAuthenticated, userPermissions, user]);

    const hasRole = useCallback((roleName: string) => {
        if (!user || !isAuthenticated) return false;
        return userRoles?.includes(roleName);
    }, [isAuthenticated, userRoles, user]);

    const hasAnyRole = useCallback((rolesNames: string[]) => {
        if (!user || !isAuthenticated) return false;
        return rolesNames.some(roleName => userRoles.includes(roleName));
    }, [isAuthenticated, userRoles, user]);

    const hasAllRoles = useCallback((roleNames: string[]) => {
        if (!user || !isAuthenticated || !roleNames?.length) return true;
        return roleNames.every(roleName => userRoles.includes(roleName));
    }, [isAuthenticated, userRoles, user]);

    const hasAnyPermission = useCallback((permissions: TPermission[]) => {
        if (!user || !isAuthenticated) return false;
        return permissions.some(permission => userPermissions.includes(permission));
    }, [isAuthenticated, userPermissions, user]);

    const hasAllPermissions = useCallback((permissions: TPermission[]) => {
        if (!user || !isAuthenticated || !permissions?.length) return true;
        return permissions.every(permission => userPermissions.includes(permission));
    }, [isAuthenticated, userPermissions, user]);

    const canAccessRoute = useCallback((requiredRoles?: string[], requiredPermissions?: TPermission[]) => {
        if (!user || !isAuthenticated) return false;

        if (!requiredRoles?.length && !requiredPermissions?.length) return true;

        try {
            const hasRequiredRoles = !requiredRoles?.length || hasAnyRole(requiredRoles);

            const hasRequiredPermissions = !requiredPermissions?.length || hasAnyPermission(requiredPermissions);

            return hasRequiredRoles && hasRequiredPermissions;
        } catch (error) {
            console.error('Erro ao verificar acesso à rota:', error);
            return false;
        }
    }, [isAuthenticated, hasAnyRole, hasAnyPermission, user]);

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