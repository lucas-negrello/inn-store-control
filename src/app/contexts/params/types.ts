import type {IUser} from "@/api/models/Users.interface.ts";

export interface IAppContext {
    userId?: string | number;
    isAuthenticated: boolean;
    user?: IUser;
    setUserId: (id?: string | number) => void;
    setUser: (user: IUser) => void;
    logout: () => void;
}