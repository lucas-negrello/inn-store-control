import type {IUser} from "@/api/models/Users.interface.ts";
import {createContext} from "react";

export type IAccountPageContext = {
    user?: IUser;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
};

export const AccountPageContext = createContext<IAccountPageContext | null>(null);