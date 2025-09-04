import type {IApiSuccess, IBaseModel} from "@/api/interfaces/ApiResponse.interface.ts";
import type {TClient} from "@/api/interfaces/Client.interface.ts";
import type {IHttpFacadeOptions} from "@/api/interfaces/HttpFacade.interface.ts";
import {environment} from "@/environments/environment.ts";
import {HttpFacade} from "@/api/facades/base/HttpFacade.ts";
import type {LocalClientStrategy} from "@/api/clients/base/LocalClientStrategy.ts";

export class CrudFacade<T extends IBaseModel> extends HttpFacade<T>{

    constructor(
        url: string,
        clientType: TClient = environment.defaultStrategy,
        options?: IHttpFacadeOptions,
        localClientStrategy?: LocalClientStrategy<T>
    ) {
        super(url, clientType, options, localClientStrategy);
    }

    getAll =
        (url?: string) =>
            this.cacheOrFetch<IApiSuccess<T[]>>(() =>
                this._client.getAll(url ?? this._url));

    get =
        (id: number | string, url?: string) =>
            this.cacheOrFetch<IApiSuccess<T>>(() =>
                this._client.get(url ?? this._url, id));

    post =
        (payload: T, url?: string) =>
            this._client.post(url ?? this._url, payload).then((res: IApiSuccess<T>) =>
            {
                this.getStorage()?.set(this._storageKey, res);
                return res;
            });

    update =
        (id: number | string, payload: T, url?: string) =>
            this._client.update(url ?? this._url, id, payload).then((res: IApiSuccess<T>) =>
            {
                this.getStorage()?.set(this._storageKey, res);
                return res;
            });


    delete =
        (id: number | string, url?: string) =>
            this._client.delete(url ?? this._url, id).then((res: IApiSuccess<T>) =>
            {
                this.getStorage()?.remove(this._storageKey);
                return res;
            });
}