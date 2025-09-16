import {type FC, useCallback, useMemo} from "react";
import type {IPermissionProps} from "@app/providers/params/types.ts";
import {useApp} from "@app/hooks/params/useApp.ts";
import type {IPermissionContext} from "@app/contexts/params/types.ts";
import {PermissionsContext} from "@app/contexts/params/PermissionsContext.tsx";

export const PermissionProvider: FC<IPermissionProps> = ({ children }) => {
    const GRANT_ALL = 'all';
    const ROLE_ADMIN = 'admin';

    const { user, isAuthenticated } = useApp();

    const userPermissions = useMemo(() => {
        if (!user || !isAuthenticated) return [];

        try {
            const directPermissions = user.permissions?.flatMap(p => p.key) || [];
            const rolePermissions = user.roles?.flatMap(role => role.permissions?.flatMap(p => p.key) || []) || [];

            return [...new Set([...directPermissions, ...rolePermissions])];
        } catch (error) {
            console.error('Erro ao Processar permissões do usuário:', error);
            return [];
        }
    }, [user, isAuthenticated]);

    const userRoles = useMemo(() => {
        if (!user || !isAuthenticated) return [];

        try {
            return user.roles?.flatMap(role => role.slug) || [];
        } catch (error) {
            console.error('Erro ao Processar regras do usuário:', error);
            return [];
        }
    }, [user, isAuthenticated]);

    const hasPermission = useCallback((permission: string) => {
        if (!user || !isAuthenticated) return false;
        return userPermissions.includes(GRANT_ALL) || userPermissions.includes(permission);
    }, [isAuthenticated, userPermissions, user]);

    const hasRole = useCallback((role: string) => {
        if (!user || !isAuthenticated) return false;
        return userRoles?.includes(ROLE_ADMIN) || userRoles?.includes(role);
    }, [isAuthenticated, userRoles, user]);

    const hasAnyRole = useCallback((roles: string[]) => {
        if (!user || !isAuthenticated) return false;
        return userRoles.includes(ROLE_ADMIN) || roles.some(slug => userRoles.includes(slug));
    }, [isAuthenticated, userRoles, user]);

    const hasAllRoles = useCallback((roles: string[]) => {
        if (!user || !isAuthenticated || !roles?.length) return true;
        return userRoles.includes(ROLE_ADMIN) || roles.every(slug => userRoles.includes(slug));
    }, [isAuthenticated, userRoles, user]);

    const hasAnyPermission = useCallback((permissions: string[]) => {
        if (!user || !isAuthenticated) return false;
        return userPermissions.includes(GRANT_ALL) || permissions.some(permission => userPermissions.includes(permission));
    }, [isAuthenticated, userPermissions, user]);

    const hasAllPermissions = useCallback((permissions: string[]) => {
        if (!user || !isAuthenticated || !permissions?.length) return true;
        return userPermissions.includes(GRANT_ALL) || permissions.every(permission => userPermissions.includes(permission));
    }, [isAuthenticated, userPermissions, user]);

    const canAccessRoute = useCallback((requiredRoles?: string[], requiredPermissions?: string[]) => {
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

    const contextValue: IPermissionContext = {
        hasPermission,
        hasRole,
        hasAnyPermission,
        hasAnyRole,
        hasAllPermissions,
        hasAllRoles,
        canAccessRoute
    };

    return (
        <PermissionsContext.Provider value={contextValue}>
            {children}
        </PermissionsContext.Provider>
    )
}