import * as process from "node:process";
import type {TClient} from "@/api/interfaces/Client.interface.ts";

function readEnvBoolean(v: unknown): boolean | undefined {
    if (typeof v === "boolean") return v;
    if (typeof v === "string") {
        const s = v.trim().toLowerCase();
        if (['1', 'true', 'yes', 'y', 'on'].includes(s)) return true;
        if (['0', 'false', 'no', 'n', 'off'].includes(s)) return false;
    }
    return undefined;
}

function readEnvString(keyVite: string, keyCRA: string): string | undefined {
    const viteVal = (import.meta as any)?.env?.[keyVite];
    if (viteVal != null) return String(viteVal);

    const craVal = (typeof process !== 'undefined' ? process?.env?.[keyCRA] : undefined);
    if (craVal != null) return String(craVal);

    return undefined;
}

function getBooleanEnv(keyVite: string, keyCRA: string, defaultValue?: boolean): boolean {
    const v = readEnvString(keyVite, keyCRA);
    const parsed = readEnvBoolean(v);
    return parsed ?? defaultValue ?? false;
}

export const Env = {
    get useLocalDb(): boolean {
        return getBooleanEnv('VITE_USE_LOCAL_DB', 'REACT_APP_USE_LOCAL_DB', true);
    },

    get localSeed(): boolean {
        return getBooleanEnv('VITE_LOCAL_DB_SEED', 'REACT_APP_LOCAL_DB_SEED', true);
    },

    get apiBaseUrl(): string {
        return readEnvString('VITE_API_BASE_URL', 'REACT_APP_API_BASE_URL')
            || 'http://localhost:3000/api';
    },

    get defaultStrategy(): TClient {
        return readEnvString('VITE_DEFAULT_STRATEGY', 'REACT_APP_DEFAULT_STRATEGY') as TClient ?? 'local';
    },

    get projectName(): string {
        return readEnvString('VITE_PROJECT_NAME', 'REACT_APP_PROJECT_NAME')
            || 'microondas-caxias';
    },

    get localClientLoadRelations(): boolean {
        return getBooleanEnv('VITE_LOCAL_CLIENT_LOAD_RELATIONS', 'REACT_APP_LOCAL_CLIENT_LOAD_RELATIONS', true);
    }
}