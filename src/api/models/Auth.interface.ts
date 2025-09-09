export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    ttl?: number;
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
}

export type ILogoutResponse = null;