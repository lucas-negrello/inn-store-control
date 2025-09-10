import {environment} from "@/environments/environment.ts";
import type {ICacheItem} from "@/utils/storage/interfaces/Storage.interface.ts";

class StorageService {
    private _keyPrefix = `${environment.projectName}--`;
    constructor(private _storage: Storage) {}

    get<T>(key: string): T | null {
        const keyWithPrefix = `${this._keyPrefix}${key}`;
        const raw = this._storage.getItem(keyWithPrefix);
        if (!raw) return null;

        try {
            const parsed = JSON.parse(raw) as ICacheItem<T>;
            if (parsed.expiresAt < Date.now()) {
                this.remove(keyWithPrefix);
                return null;
            }
            return parsed.value;
        } catch {
            return null;
        }
    }

    set<T>(key: string, value: T, ttl?: number): void {
        const expiresAt = Date.now() + (ttl ?? 1000 * 60 * 60 * 24 * 7); // Default to 7 days
        this._storage.setItem(`${this._keyPrefix}${key}`, JSON.stringify({ value, expiresAt }));
    }

    remove(key: string): void {
        this._storage.removeItem(`${this._keyPrefix}${key}`);
    }

    clear(): void {
        this._storage.clear();
    }
}

export const localStorageService = new StorageService(localStorage);
export const sessionStorageService = new StorageService(sessionStorage);