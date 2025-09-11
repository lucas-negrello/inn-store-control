export interface IPermission {
    id?: number | string;
    key: string;
    description?: string;
    created_at?: string; // ISO
    updated_at?: string; // ISO
}