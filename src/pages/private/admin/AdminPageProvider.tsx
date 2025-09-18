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

export const AdminPageProvider = ({ children }: IAdminPageProviderType) => {
    // Global contexts
    const { isAuthenticated, isLoading, checkAuth } = useApp();

    // Local states
    const [loading, setLoading] = useState<boolean>(isLoading);
    const [requestInProgress, setRequestInProgress] = useState<boolean>(false);

    const [errors, setErrors] = useState<string | null>(null);

    const [roles, setRoles] = useState<IRole[]>([]);
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);

    // Auxiliary functions
    const startRequests = useCallback(async () => {
        setLoading(true);
        setRequestInProgress(true);

        await checkAuth();

        if (!isAuthenticated) throw 'User is not authenticated';
    }, [isAuthenticated, checkAuth]);
    const finishRequests = useCallback(() => {
        setLoading(false);
        setRequestInProgress(false);
    }, []);

    // Roles CRUD
    const getRoles = useCallback(async () => {
        try {
            await startRequests();

            const response = await RoleService.getRoles();
            setRoles(response.data);

            return response.data;
        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return [];
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);
    const getRole = useCallback(async (roleId: number | string) => {
        try {
            await startRequests();

            const response = await RoleService.getRoleById(roleId);
            return response.data;

        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return null;
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);
    const createRole = useCallback(async (payload: IRole) => {
        try {
            await startRequests();

            const response = await RoleService.createRole(payload);
            return response.data;

        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return null;
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);
    const updateRole = useCallback(async (roleId: number | string, payload: Partial<IRole>) => {
        try {
            await startRequests();

            const response = await RoleService.updateRole(roleId, payload);
            return response.data;

        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return null;
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);
    const deleteRole = useCallback(async (roleId: number | string) => {
        try {
            await startRequests();

            await RoleService.deleteRole(roleId);
            return;

        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return null;
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);

    // Permissions CRUD
    const getPermissions = useCallback(async () => {
        try {
            await startRequests();

            const response = await PermissionService.getPermissions();
            setPermissions(response.data);

            return response.data;
        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return [];
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);
    const getPermission = useCallback(async (permissionId: number | string) => {
        try {
            await startRequests();

            const response = await PermissionService.getPermissionById(permissionId);
            return response.data;

        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return null;
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);
    const createPermission = useCallback(async (payload: IPermission) => {
        try {
            await startRequests();

            const response = await PermissionService.createPermission(payload);
            return response.data;

        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return null;
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);
    const updatePermission = useCallback(async (permissionId: number | string, payload: Partial<IPermission>) => {
        try {
            await startRequests();

            const response = await PermissionService.updatePermission(permissionId, payload);
            return response.data;

        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return null;
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);
    const deletePermission = useCallback(async (permissionId: number | string) => {
        try {
            await startRequests();

            await PermissionService.deletePermission(permissionId);
            return;

        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return null;
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);

    // Users CRUD
    const getUsers = useCallback(async () => {
        try {
            await startRequests();

            const response = await UserService.getUsers();
            setUsers(response.data);

            return response.data;
        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return [];
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);
    const getUser = useCallback(async (userId: number | string) => {
        try {
            await startRequests();

            const response = await UserService.getUserById(userId);
            return response.data;

        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return null;
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);
    const createUser = useCallback(async (payload: IUser) => {
        try {
            await startRequests();

            const response = await UserService.createUser(payload);
            return response.data;

        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return null;
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);
    const updateUser = useCallback(async (userId: number | string, payload: Partial<IUser>) => {
        try {
            await startRequests();

            const response = await UserService.updateUser(userId, payload);
            return response.data;

        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return null;
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);
    const deleteUser = useCallback(async (userId: number | string) => {
        try {
            await startRequests();

            await UserService.deleteUser(userId);
            return;

        } catch (error) {
            console.error(error);
            setErrors(error as string);
            return null;
        } finally {
            finishRequests();
        }
    }, [finishRequests, startRequests]);
    
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
            { children }
        </AdminPageContext.Provider>
    );

}