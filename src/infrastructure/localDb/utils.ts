import Dexie, {type IndexableType, type Table} from 'dexie';
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

export async function firstOrCreate<T extends { id?: BaseIdType }>(
    table: Table<T, BaseIdType>,
    index: string,
    key: IndexableType | IndexableType[],
    data: Omit<T, 'id'>,
    options?: { override?: boolean }
) {
    const { override = false } = options ?? {};

    const logic = async () => {
        let existing = await table.where(index).equals(key as any).first();

        if (existing) {
            if (!override) {
                return existing;
            }

            const updated = { ...existing, ...data };
            await table.put(updated);
            return updated;
        }

        try {
            const id = await table.add(data as T);
            return { ...(data as T), id } as T;
        } catch (error: any) {
            if (error && error.name === 'ConstraintError') {
                existing = await table.where(index).equals(key as any).first();
                if (existing) {
                    if (!override) return existing;
                    const updated = { ...existing, ...data, id: existing.id } as T;
                    await table.put(updated);
                    return updated;
                }
                throw error;
            }
        }
    };

    if (Dexie.currentTransaction) {
        return logic();
    }

    return table.db.transaction('rw', table, logic);
}

export function nowIso() {
    return new Date().toISOString();
}