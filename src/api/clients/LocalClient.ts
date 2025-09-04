import type {IHttpClientStrategy} from "@/api/clients/base/HttpClientStrategy.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import type {LocalClientStrategy} from "@/api/clients/base/LocalClientStrategy.ts";

export class LocalClient<T = any> implements IHttpClientStrategy<T> {
    constructor(private readonly _localClient: LocalClientStrategy<T>) {}

    delete(url: string, id: number | string, props?: any): Promise<IApiSuccess<T>> {
        return this._localClient.delete(id, props) as Promise<IApiSuccess<T>>;
    }

    get(url: string, id: number | string, props?: any): Promise<IApiSuccess<T>> {
        return this._localClient.findById(id, props);
    }

    getAll(url: string, props?: any): Promise<IApiSuccess<T[]>> {
        return this._localClient.list(undefined, props);
    }

    post(url: string, payload: T, props?: any): Promise<IApiSuccess<T>> {
        return this._localClient.create(payload, props);
    }

    update(url: string, id: number | string, payload: Partial<T>, props?: any): Promise<IApiSuccess<T>> {
        return this._localClient.update(id, payload, props);
    }

}