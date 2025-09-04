export type TPermission = keyof typeof CPermission;

export const CPermission = {
    create: 'create',
    read: 'read',
    update: 'update',
    delete: 'delete',
} as const;

export interface IPermission {
    id?: number | string;
    key: string;
    description?: string;
    created_at?: string; // ISO
    updated_at?: string; // ISO
}