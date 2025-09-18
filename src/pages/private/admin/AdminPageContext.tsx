import type {IRole} from "@/api/models/Roles.interface.ts";
import type {IPermission} from "@/api/models/Permissions.interface.ts";
import type {IUser} from "@/api/models/Users.interface.ts";
import {createContext} from "react";

export type IAdminPageContext = {
    roles: IRole[];
    permissions: IPermission[];
    users: IUser[];

    isLoading: boolean;
    requestInProgress: boolean;

    errors: string | null;

    setIsLoading: (loading: boolean) => void;
    setErrors: (error: string | null) => void;

    getRoles: () => Promise<IRole[]>;
    getRole: (roleId: number | string) => Promise<IRole | null>;
    createRole: (payload: IRole) => Promise<IRole | null>;
    updateRole: (roleId: number | string, payload: Partial<IRole>) => Promise<IRole | null>;
    deleteRole: (roleId: number | string) => Promise<void | null>;

    getPermissions: () => Promise<IPermission[]>;
    getPermission: (permissionId: number | string) => Promise<IPermission | null>;
    createPermission: (payload: IPermission) => Promise<IPermission | null>;
    updatePermission: (permissionId: number | string, payload: Partial<IPermission>) => Promise<IPermission | null>;
    deletePermission: (permissionId: number | string) => Promise<void | null>;

    getUsers: () => Promise<IUser[]>;
    getUser: (userId: number | string) => Promise<IUser | null>;
    createUser: (payload: IUser) => Promise<IUser | null>;
    updateUser: (userId: number | string, payload: Partial<IUser>) => Promise<IUser | null>;
    deleteUser: (userId: number | string) => Promise<void | null>;
}

export const AdminPageContext =
    createContext<IAdminPageContext | null>(null);