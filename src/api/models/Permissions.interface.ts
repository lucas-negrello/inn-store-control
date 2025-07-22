export type TPermission = keyof typeof CPermission;

export const CPermission = {
    create: 'create',
    read: 'read',
    update: 'update',
    delete: 'delete',
} as const;