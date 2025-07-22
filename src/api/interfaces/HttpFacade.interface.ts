import type {TStorage} from "@/utils/storage/interfaces/Storage.interface.ts";

export interface IHttpFacadeOptions {
    useStorage?: boolean;
    storageType?: TStorage;
    cacheKey?: string;
    cacheTTL?: number;
}