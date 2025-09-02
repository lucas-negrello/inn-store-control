import type {IHttpClientStrategy} from "@/api/clients/base/HttpClientStrategy.ts";
import type {IApiError, IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import {localStorageService, sessionStorageService} from "@/utils/storage/services/StorageService.ts";
import type {ILoginCredentials, ILoginResponse} from "@/api/models/Auth.interface.ts";
import type {IUser} from "@/api/models/Users.interface.ts";

const AUTH_KEY = "auth_token";

const createToken = (sub: number | string, ttlSec: number): string => {
    const now = Date.now();
    const exp = now + ttlSec * 1000;
    const rnd = Math.random().toString(36).substring(2);
    const payload = { sub, iat: now, exp, rnd };
    return btoa(JSON.stringify(payload));
};

const decodeToken = (token: string): { sub: number | string; iat: number; exp: number; rnd: string } | null => {
    try {
        const obj = JSON.parse(atob(token));
        if (!obj || typeof obj !== 'object') return null;
        return obj;
    } catch {
        return null;
    }
};

const getStoredToken = (): string | null =>
    localStorageService.get<string>(AUTH_KEY) ?? sessionStorageService.get<string>(AUTH_KEY) ?? null;

const clearStoredToken = (): void => {
    localStorageService.remove(AUTH_KEY);
    sessionStorageService.remove(AUTH_KEY);
}

export class MockClient<T> implements IHttpClientStrategy<T> {
    async post(url: string, payload: T): Promise<IApiSuccess<T>> {
        if (url.endsWith('/login') || url === 'auth/login') {
            const res = await this._loginPostHandler({...payload as ILoginCredentials});
            return res as IApiSuccess<T>;
        }
        if (url.endsWith('/logout') || url === 'auth/logout') {
            clearStoredToken();
            return {
                success: true,
                data: null as unknown as T,
                message: "Mock LOGOUT request successful",
                code: 200
            } as IApiSuccess<T>;
        }
        return {
            success: true,
            data: payload,
            message: "Mock POST request successful",
            code: 201
        }
    }

    async getAll(url: string): Promise<IApiSuccess<T[]>> {
        const response = await import(`@/assets/mock/${url}.json`);
        return {
            success: true,
            data: response.default as T[],
            message: "Mock GET ALL request successful",
            code: 200
        } as IApiSuccess<T[]>;
    }

    async get(url: string, id: number | string): Promise<IApiSuccess<T>> {
        if ((url === 'auth' && id === 'me' || url === 'me')) {
            const res = await this._meGetHandler();
            return res as IApiSuccess<T>;
        }
        const response = await import(`@/assets/mock/${url}.json`);
        const data = response.default.find((item: T) => (item as any).id === id);
        return {
            success: !!data,
            data: data ?? ({} as T),
            message: data ? 'Mock GET request successful' : 'Item not found',
            code: data ? 200 : 404
        }
    }

    async update(url: string, id: number | string, payload: T): Promise<IApiSuccess<T>> {
        return {
            success: true,
            data: payload,
            message: "Mock UPDATE request successful",
            code: 200
        }
    }

    async delete(url: string, id: number | string): Promise<IApiSuccess<T>> {
        return {
            success: true,
            data: {} as T,
            message: "Mock DELETE request successful",
            code: 200
        }
    }

    private _loginPostHandler = async ({ email, password }: ILoginCredentials) => {
        const data = await import('@/assets/mock/users.json');
        const users = data.default as IUser[];

        const user = users.find((u) =>
            (!!email && u.email === email && u.password === password));

        if (!user) return {
            success: false,
            data: null,
            message: "Invalid credentials",
            code: 401
        } as IApiSuccess<null>;

        const ttl = 60 * 60 * 24; // 1 day
        const token = createToken(user.id!, ttl);

        return {
            success: true,
            data: { token, ttl },
            message: "Mock LOGIN request successful",
            code: 200
        } as IApiSuccess<ILoginResponse>;
    };

    private _meGetHandler = async () => {
        const token = getStoredToken();
        if (!token) return {
            success: false,
            data: null,
            message: "Unauthorized",
            code: 401
        } as IApiSuccess<null>;

        const decoded = decodeToken(token);
        if (!decoded || decoded.exp <= Date.now()) {
            clearStoredToken();
            return {
                success: false,
                data: null,
                message: "Token expired",
                code: 401
            } as IApiSuccess<null>;
        }

        const data = await import('@/assets/mock/users.json');
        const users = data.default as IUser[];
        const user = users.find((u) => u.id === Number(decoded.sub) || u.id === decoded.sub);

        if (!user) return {
            success: false,
            data: null,
            message: "User not found",
            code: 404
        } as IApiSuccess<null>;

        const { password, ...userData } = user as unknown as Record<string, unknown>;
        return {
            success: true,
            data: userData as Omit<IUser, 'password'>,
            message: "Mock ME request successful",
            code: 200
        } as IApiSuccess<Omit<IUser, 'password'>>;
    };
}