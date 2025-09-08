import type {IHttpClientStrategy} from "@/api/clients/base/HttpClientStrategy.ts";
import type {TStorage} from "@/utils/storage/interfaces/Storage.interface.ts";
import type {TClient} from "@/api/interfaces/Client.interface.ts";
import type {IHttpFacadeOptions} from "@/api/interfaces/HttpFacade.interface.ts";
import {ApiContext} from "@/api/strategies/ApiContext.ts";
import {
    localStorageService,
    sessionStorageService,
    type StorageService
} from "@/utils/storage/services/StorageService.ts";
import {Env} from "@/config/env.ts";

export abstract class HttpFacade<T> {
    protected readonly _client: IHttpClientStrategy<T>;
    protected readonly _useStorage: boolean;
    protected readonly _storageType: TStorage;
    protected readonly _storageKey: string;
    protected readonly _cacheTTL?: number;

    protected constructor(
        protected readonly _url: string,
        protected readonly _clientType: TClient = Env.defaultStrategy,
        protected readonly _options?: IHttpFacadeOptions,
    ) {
        const context = new ApiContext<T>(this._clientType);
        this._client = context.client;

        this._useStorage = this._options?.useStorage ?? false;
        this._storageType = this._options?.storageType ?? "local";
        this._storageKey = this._options?.cacheKey ?? this._url;
        this._cacheTTL = this._options?.cacheTTL;
    }

    protected getStorage(): StorageService | null {
        if (!this._useStorage) return null;
        return this._storageType === "local" ? localStorageService : sessionStorageService;
    }

    protected async cacheOrFetch<R>(fetchFn: () => Promise<R>): Promise<R> {
        const storage = this.getStorage();
        if (storage) {
            const cached = storage.get<R>(this._storageKey);
            if (cached) return Promise.resolve(cached);
        }

        const res = await fetchFn();
        if (storage) storage.set(this._storageKey, res, this._cacheTTL);
        return res;
    }
}