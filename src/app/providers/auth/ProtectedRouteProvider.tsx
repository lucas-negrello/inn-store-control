import type {FC} from "react";
import type {IProtectedRouteProps} from "@app/providers/auth/types.ts";
import {useApp} from "@app/hooks/params/useApp.ts";
import {Navigate, useLocation} from "react-router-dom";
import {Box, CircularProgress} from "@mui/material";

export const ProtectedRouteProvider: FC<IProtectedRouteProps> = ({
    children,
    requireAuth = true
}) => {
    const { isAuthenticated, isLoading, user } = useApp();
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
            <Navigate to="/auth/login"
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

    return <>{children}</>
}