import {type Table} from 'dexie';
import type {BaseIdType, SoftDeleteEntity} from "@/infrastructure/localDb/entities.ts";

export async function ensurePivot<T extends { id?: BaseIdType }>
(
    table: Table<T, BaseIdType>,
    whereFn: () => Promise<T | undefined>,
    createFn: () => Promise<BaseIdType>
) {
    const existing = await whereFn();
    if (existing) return existing.id;
    return await createFn();
}

export async function ensureNotDeleted<T extends SoftDeleteEntity>(
    table: Table<T, BaseIdType>,
    id: BaseIdType
) {
    const existing = await table.get(id);
    if (!existing) return false;
    return !!existing.deleted_at;
}

export function nowIso() {
    return new Date().toISOString();
}