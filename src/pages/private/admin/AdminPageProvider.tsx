import {type ReactNode, useCallback, useEffect, useState} from "react";
import {useApp} from "@app/hooks/params/useApp.ts";
import {AdminPageContext, type IAdminPageContext} from "@/pages/private/admin/AdminPageContext.tsx";
import {RoleService} from "@/api/services/RoleService.ts";
import type {IRole} from "@/api/models/Roles.interface.ts";
import type {IPermission} from "@/api/models/Permissions.interface.ts";
import type {IUser} from "@/api/models/Users.interface.ts";
import {PermissionService} from "@/api/services/PermissionService.ts";
import {UserService} from "@/api/services/UserService.ts";

type IAdminPageProviderType = {
    children: ReactNode;
}

export const AdminPageProvider = ({children}: IAdminPageProviderType) => {
    // Global contexts
    const {isLoading: appLoading, isAuthenticated} = useApp();

    // Local states
    const [loading, setLoading] = useState<boolean>(appLoading);
    const [requestInProgress, setRequestInProgress] = useState<boolean>(false);

    const [errors, setErrors] = useState<string | null>(null);

    const [roles, setRoles] = useState<IRole[]>([]);
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);

    // Auxiliary functions
    const withAuth = useCallback(async <T, >(fn: () => Promise<T>): Promise<T> => {
        if (!isAuthenticated) throw 'User is not authenticated';
        setRequestInProgress(true);
        try {
            return await fn();
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error(error);
            setErrors(msg);
            throw error;
        } finally {
            setRequestInProgress(false);
        }
    }, [isAuthenticated]);

    // Autoload initial data once
    useEffect(() => {
        let cancelled = false;
        if (appLoading || !isAuthenticated) return;

        const loadInitial = async () => {
            setLoading(true);
            setErrors(null);
            try {
                const [userRes, roleRes, permRes] = await Promise.all([
                    UserService.getUsers(),
                    RoleService.getRoles(),
                    PermissionService.getPermissions()
                ]);

                if (!cancelled) {
                    setUsers(userRes.data ?? []);
                    setRoles(roleRes.data ?? []);
                    setPermissions(permRes.data ?? []);
                }
            } catch (error) {
                if (!cancelled) {
                    const msg = error instanceof Error ? error.message : String(error);
                    console.error(error);
                    setErrors(msg);
                    setUsers([]);
                    setRoles([]);
                    setPermissions([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadInitial();
        return () => {
            cancelled = true;
        }
    }, [appLoading, isAuthenticated]);

    // Roles CRUD
    const getRoles =
        useCallback(async () =>
            withAuth(async () => {
                const response = await RoleService.getRoles();
                setRoles(response.data);
                return response.data;
            }), [withAuth]
        );

    const getRole =
        useCallback(async (roleId: number | string) =>
            withAuth(async () => {
                const response = await RoleService.getRoleById(roleId);
                return response.data ?? null;
            }), [withAuth]
        );

    const createRole =
        useCallback(async (payload: IRole) =>
            withAuth(async () => {
                const response = await RoleService.createRole(payload);
                await getRoles();
                return response.data ?? null;
            }), [withAuth, getRoles]
        );

    const updateRole =
        useCallback(async (roleId: number | string, payload: Partial<IRole>) =>
            withAuth(async () => {
                const response = await RoleService.updateRole(roleId, payload);
                await getRoles();
                return response.data ?? null;
            }), [withAuth, getRoles]
        );

    const deleteRole =
        useCallback(async (roleId: number | string) =>
            withAuth(async () => {
                await RoleService.deleteRole(roleId);
                await getRoles();
            }), [withAuth, getRoles]
        );

    // Permissions CRUD
    const getPermissions =
        useCallback(async () => withAuth(async () => {
                const response = await PermissionService.getPermissions();
                setPermissions(response.data ?? []);
                return response.data ?? [];
            }), [withAuth]
        );

    const getPermission =
        useCallback(async (permissionId: number | string) =>
            withAuth(async () => {
                const response = await PermissionService.getPermissionById(permissionId);
                return response.data ?? null;
            }), [withAuth]
        );

    const createPermission =
        useCallback(async (payload: IPermission) =>
            withAuth(async () => {
                const response = await PermissionService.createPermission(payload);
                await getPermissions();
                return response.data ?? null;
            }), [withAuth, getPermissions]
        );

    const updatePermission =
        useCallback(async (permissionId: number | string, payload: Partial<IPermission>) =>
            withAuth(async () => {
                const response = await PermissionService.updatePermission(permissionId, payload);
                await getPermissions();
                return response.data ?? null;
            }), [withAuth, getPermissions]
        );

    const deletePermission =
        useCallback(async (permissionId: number | string) =>
            withAuth(async () => {
                await PermissionService.deletePermission(permissionId);
                await getPermissions();
            }), [withAuth, getPermissions]
        );

    // Users CRUD
    const getUsers =
        useCallback(async () => withAuth(async () => {
                const response = await UserService.getUsers();
                setUsers(response.data ?? []);
                return response.data ?? [];
            }), [withAuth]
        );

    const getUser =
        useCallback(async (userId: number | string) =>
            withAuth(async () => {
                const response = await UserService.getUserById(userId);
                return response.data ?? null;
            }), [withAuth]
        );

    const createUser =
        useCallback(async (payload: IUser) =>
            withAuth(async () => {
                const response = await UserService.createUser(payload);
                await getUsers();
                return response.data ?? null;
            }), [withAuth, getUsers]
        );

    const updateUser =
        useCallback(async (userId: number | string, payload: Partial<IUser>) =>
            withAuth(async () => {
                const response = await UserService.updateUser(userId, payload);
                await getUsers();
                return response.data ?? null;
            }), [withAuth, getUsers]
        );

    const deleteUser =
        useCallback(async (userId: number | string) =>
            withAuth(async () => {
                await UserService.deleteUser(userId);
                await getUsers();
            }), [withAuth, getUsers]
        );
    // Context value
    const contextValue: IAdminPageContext = {
        isLoading: loading,
        requestInProgress,

        errors,

        setIsLoading: setLoading,
        setErrors,

        users,
        roles,
        permissions,

        getRoles,
        getRole,
        createRole,
        updateRole,
        deleteRole,

        getPermissions,
        getPermission,
        createPermission,
        updatePermission,
        deletePermission,

        getUsers,
        getUser,
        createUser,
        updateUser,
        deleteUser,
    };

    return (
        <AdminPageContext.Provider value={contextValue}>
            {children}
        </AdminPageContext.Provider>
    );

}