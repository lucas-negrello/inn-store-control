import type {IHttpClientStrategy} from "@/api/clients/base/HttpClientStrategy.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import {LocalConfig} from "@/api/config/local.config.ts";
import {Env} from "@/config/env.ts";

export class LocalClient<T = any> implements IHttpClientStrategy<T> {
    private _localConfig = new LocalConfig<T>();

    private _useLocalDb = () => {
        if (!Env.useLocalDb)
            return this._localConfig.fail('LocalDB disabled', 500);
    }

    async post(url: string, payload: T, props?: any): Promise<IApiSuccess<T>> {
        await this._useLocalDb();
        try {
            const resource = this._localConfig.resolveResource(url);
            const service = this._localConfig.getService(resource);
            if (!service)
                return this._localConfig.fail('Service not found', 404);
            if (service.create && typeof service.create === 'function')
                return service.create(payload, props);
            if (service.login && typeof service.login === 'function')
                return service.login(payload);
            if (service.register && typeof service.register === 'function')
                return service.register(payload);
            if (service.logout && typeof service.logout === 'function')
                return service.logout(payload);
            else return this._localConfig.fail('Service not found', 404);
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
        try {
            const resource = this._localConfig.resolveResource(url);
            const service = this._localConfig.getService(resource);
            if (!service)
                return this._localConfig.fail('Service not found', 404);
            if (service.getById && typeof service.getById === 'function')
                return service.getById(id, props);
            if (service.me && typeof service.me === 'function')
                return service.me(id);
            else return this._localConfig.fail('Service not found', 404);
        } catch (e: any) {
            return this._localConfig.fail(e?.message || 'Fail on get local resource' , 500);
        }
    }

}