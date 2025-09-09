import type {IUser} from "@/api/models/Users.interface.ts";

export const ACCESS_TTL_MINUTES = 30;
export const REFRESH_TTL_DAYS = 7;

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    ttl?: number;
    refresh_token?: string;
    user: IUser;
}

export interface IRegisterCredentials {
    email: string;
    name: string;
    password: string;
    password_confirmation: string;
}
export interface IRegisterResponse {
    token: string;
    ttl?: number;
    refresh_token?: string;
    user: IUser;
}

export type ILogoutResponse = null;

export interface IRefreshTokenResponse {
    token: string;
    ttl?: number;
}