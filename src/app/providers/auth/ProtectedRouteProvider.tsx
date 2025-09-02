import type {FC} from "react";
import type {IProtectedRouteProps} from "@app/providers/auth/types.ts";
import {useApp} from "@app/hooks/params/useApp.ts";
import {Navigate, useLocation} from "react-router-dom";
import {Alert, Box, CircularProgress} from "@mui/material";
import {usePermissions} from "@app/hooks/params/usePermissions.ts";

export const ProtectedRouteProvider: FC<IProtectedRouteProps> = ({
    children,
    requireAuth = true,
    roles = [],
    permissions = [],
    requireAll = false,
    fallbackRoute = '/auth/login'
}) => {
    const { isAuthenticated, isLoading, user } = useApp();
    const { hasAllRoles, hasAllPermissions, canAccessRoute } = usePermissions();
    const location = useLocation();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (requireAuth && !isAuthenticated) {
        return (
            <Navigate to="/"
                      state={{ from: location.pathname }}
                      replace />
        );
    }

    if (requireAuth && isAuthenticated && user) {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const userIdInPath = pathSegments[0];

        if (userIdInPath && String(user.id) !== String(userIdInPath)) {
            return (
                <Navigate to={`/${user.id}`} replace />
            );
        }
    }

    if (!requireAuth && isAuthenticated && user) {
        return (
            <Navigate to={`/${user.id}`} replace />
        );
    }

    if (requireAuth && isAuthenticated && (roles.length > 0 || permissions.length > 0)) {
        let hasAccess = false;

        if (requireAll) {
            const hasRequiredRoles = !roles.length || hasAllRoles(roles);
            const hasRequiredPermissions = !permissions.length || hasAllPermissions(permissions);
            hasAccess = hasRequiredRoles && hasRequiredPermissions;
        } else {
            hasAccess = canAccessRoute(roles, permissions);
        }

        if (!hasAccess) {
            return (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh"
                    p={3}
                >
                    <Alert severity="error">
                        Você não tem permissão para acessar esta página.
                    </Alert>
                </Box>
            );
        }
    }

    return <>{children}</>
}