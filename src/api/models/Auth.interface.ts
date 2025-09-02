export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    ttl?: number;
}