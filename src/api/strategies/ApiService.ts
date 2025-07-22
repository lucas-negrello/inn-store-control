import type {IApiSuccess, IBaseModel} from "@/api/interfaces/ApiResponse.interface.ts";
import type {IHttpClientStrategy} from "@/api/clients/base/HttpClientStrategy.ts";
import type {TClient} from "@/api/interfaces/Client.interface.ts";
import {ApiContext} from "@/api/strategies/ApiContext.ts";
import type {IHttpFacadeOptions} from "@/api/interfaces/HttpFacade.interface.ts";
import {localStorageService, sessionStorageService, StorageService} from "@/utils/storage/services/StorageService.ts";
import type {TStorage} from "@/utils/storage/interfaces/Storage.interface.ts";

export class HttpFacade<T extends IBaseModel> {

    private readonly _client: IHttpClientStrategy<T>;
    private readonly _useStorage: boolean;
    private readonly _storageType: TStorage;
    private readonly _storageKey: string;

    constructor(
        private readonly _url: string,
        private readonly _clientType: TClient = "mock",
        private readonly _options?: IHttpFacadeOptions,
    ) {
        const context = new ApiContext<T>(this._clientType);
        this._client = context.client;

        this._useStorage = this._options?.useStorage ?? false;
        this._storageType = this._options?.storageType ?? 'local';
        this._storageKey = this._options?.cacheKey ?? this._url;
    }

    getAll(url?: string) {
        return this._cacheOrFetch<IApiSuccess<T[]>>(
            () =>
                this._client.getAll(url ?? this._url)
        );
    }

    get(id: number | string, url?: string) {
        return this._cacheOrFetch<IApiSuccess<T>>(
            () =>
                this._client.get(url ?? this._url, id)
        );
    }

    post(payload: T, url?: string) {
        return this._client.post(url ?? this._url, payload).then((res) => {
            this._getStorage()?.set(this._storageKey, res);
            return res;
        });
    }

    update(id: number | string, payload: T, url?: string) {
        return this._client.update(url ?? this._url, id, payload).then((res) => {
            this._getStorage()?.set(this._storageKey, res);
            return res;
        });
    }

    delete(id: number | string, url?: string) {
        return this._client.delete(url ?? this._url, id).then((res) => {
            this._getStorage()?.remove(this._storageKey);
            return res;
        });
    }

    private _getStorage(): StorageService | null {
        if (!this._useStorage) return null;
        return this._storageType === 'local' ? localStorageService : sessionStorageService;
    }

    private _cacheOrFetch<R>(fetchFn: () => Promise<R>): Promise<R> {
        const storage = this._getStorage();
        if (storage) {
            const cached = storage.get<R>(this._storageKey);
            if (cached) return Promise.resolve(cached);
        }

        return fetchFn().then(res => {
            if (storage) storage.set(this._storageKey, res);
            return res;
        })
    }
}