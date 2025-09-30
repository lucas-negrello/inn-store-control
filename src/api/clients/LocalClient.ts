import type {IHttpClientStrategy} from "@/api/clients/base/HttpClientStrategy.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import {LocalConfig} from "@/api/config/local.config.ts";
import {Env} from "@/config/env.ts";
import type {ILoginCredentials} from "@/api/models/Auth.interface.ts";
import {AuthService as LocalAuthService} from "@/infrastructure/localDb/services";
import {UsersService as LocalUserService} from "@/infrastructure/localDb/services";
import {localStorageService} from "@/utils/storage/services/StorageService.ts";
import {ResponseAdapter} from "@/infrastructure/localDb/adapters/ResponseAdapter.ts";

export class LocalClient<T = any> implements IHttpClientStrategy<T> {
    private _localConfig = new LocalConfig<T>();

    private _useLocalDb = () => {
        if (!Env.useLocalDb)
            return this._localConfig.fail('LocalDB disabled', 500);
    }

    async post(url: string, payload: T, props?: any): Promise<IApiSuccess<T>> {
        await this._useLocalDb();
        const norm = url.replace(/^\//, '').toLowerCase();

        if (norm === 'auth/login') {
            try {
                const creds = payload as ILoginCredentials;
                const result = await LocalAuthService.login(creds);
                const ttl = result.ttl && result.ttl * 1000 * 24 * 7;
                localStorageService.set('auth_token', result.token, ttl);
                return ResponseAdapter.toResponse(result as T);
            } catch (e: any) {
                return this._localConfig.fail(e?.message || 'Falha ao logar');
            }
        }
        if (norm === 'auth/register') {
            throw new Error('Endpoint is not ready');
        }
        if (norm === 'auth/logout') {
            const token = localStorageService.get('auth_token') as string | null;
            if (token) {
                await LocalAuthService.logout(token);
                localStorageService.remove('auth_token');
            }
            return ResponseAdapter.toResponse(null as T, 200, 'Logout Successfully');
        }
        if (norm === 'auth/refresh') {
            throw new Error('Endpoint is not ready');
        }
        try {
            const resource = this._localConfig.resolveResource(url);
            const service = this._localConfig.getService(resource);
            if (!service || typeof service.create !== 'function')
                return this._localConfig.fail('Service not found', 404);
            return service.create(payload, props);
        } catch (e: any) {
            return this._localConfig.fail(e?.message || 'Fail on create local resource' , 500);
        }
    }

    async update(url: string, id: number | string, payload: Partial<T>, props?: any): Promise<IApiSuccess<T>> {
        await this._useLocalDb();
        try {
            const resource = this._localConfig.resolveResource(url);
            const service = this._localConfig.getService(resource);
            if (!service || typeof service.update !== 'function')
                return this._localConfig.fail('Service not found (It must have the "update" method)', 404);
            return service.update(id, payload, props);
        } catch (e: any) {
            return this._localConfig.fail(e?.message || 'Fail on update local resource' , 500);
        }
    }

    async delete(url: string, id: number | string, props?: any): Promise<IApiSuccess<T>> {
        await this._useLocalDb();
        try {
            const resource = this._localConfig.resolveResource(url);
            const service = this._localConfig.getService(resource);
            if (!service || typeof service.delete !== 'function')
                return this._localConfig.fail('Service not found (It must have the "delete" method)', 404);
            return service.delete(id, props);
        } catch (e: any) {
            return this._localConfig.fail(e?.message || 'Fail on deleting local resource' , 500);
        }
    }

    async getAll(url: string, props?: any): Promise<IApiSuccess<T[]>> {
        await this._useLocalDb();
        try {
            const resource = this._localConfig.resolveResource(url);
            const service = this._localConfig.getService(resource);
            if (!service || typeof service.list !== 'function')
                return this._localConfig.fail('Service not found (It must have the "list" method)', 404);
            return service.list(props);
        } catch (e: any) {
            return this._localConfig.fail(e?.message || 'Fail on get local list' , 500);
        }
    }

    async get(url: string, id: number | string, props?: any): Promise<IApiSuccess<T>> {
        await this._useLocalDb();
        const normBase = url.replace(/^\//, '').toLowerCase();
        if (normBase === 'auth' && id === 'me') {
            const token = localStorageService.get('auth_token') as string | null;
            if (!token) return this._localConfig.fail('Not Authenticated', 403);
            const user = await LocalAuthService.me();
            if (!user) return this._localConfig.fail('Invalid or Expired token', 400);
            const fullUser = await LocalUserService.getUserWithAllRelationships(user.id!);
            return ResponseAdapter.toResponse(fullUser as T);
        }
        try {
            const resource = this._localConfig.resolveResource(url);
            const service = this._localConfig.getService(resource);
            if (!service || typeof service.findById !== 'function')
                return this._localConfig.fail('Service not found', 404);
            return service.findById(id, props);
        } catch (e: any) {
            return this._localConfig.fail(e?.message || 'Fail on get local resource' , 500);
        }
    }

}