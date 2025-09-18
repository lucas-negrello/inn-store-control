import type {IUser} from "@/api/models/Users.interface.ts";

export interface IAppContext {
    userId?: string | number;
    isAuthenticated: boolean;
    user?: IUser;
    isLoading: boolean;
    setUserId: (id?: string | number) => void;
    setUser: (user: IUser) => void;
    login: (user: IUser) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
}

export interface IPermissionContext {
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    hasAllRoles: (roles: string[]) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
    canAccessRoute: (requiredRoles?: string[], requiredPermissions?: string[]) => boolean;
}