import {environment} from "@/environments/environment.ts";

export class StorageService {
    private _keyPrefix = `${environment.projectName}--`;
    constructor(private _storage: Storage) {}

    get<T>(key: string): T | null {
        const value = this._storage.getItem(`${this._keyPrefix}${key}`);
        return value ? JSON.parse(value) as T : null;
    }

    set<T>(key: string, value: T): void {
        this._storage.setItem(`${this._keyPrefix}${key}`, JSON.stringify(value));
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