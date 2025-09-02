import type {IUser} from "@/api/models/Users.interface.ts";
import type {TPermission} from "@/api/models/Permissions.interface.ts";

export interface IAppContext {
    userId?: string | number;
    isAuthenticated: boolean;
    user?: IUser;
    isLoading: boolean;
    setUserId: (id?: string | number) => void;
    setUser: (user: IUser) => void;
    login: (user: IUser) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export interface IPermissionContext {
    hasPermission: (permission: TPermission) => boolean;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    hasAllRoles: (roles: string[]) => boolean;
    hasAnyPermission: (permissions: TPermission[]) => boolean;
    hasAllPermissions: (permissions: TPermission[]) => boolean;
    canAccessRoute: (requiredRoles?: string[], requiredPermissions?: TPermission[]) => boolean;
}