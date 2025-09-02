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
    checkAuth: () => Promise<void>;
}