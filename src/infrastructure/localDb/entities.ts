export type BaseIdType = number | string;

export interface BaseEntity {
    id?: BaseIdType;
    created_at?: string; // ISO
    updated_at?: string; // ISO
}

export interface SoftDeleteEntity extends BaseEntity {
    deleted_at?: string; // ISO
}

export interface UserEntity extends SoftDeleteEntity {
    email: string;
    name: string;
    password_hash?: string;
    is_active: boolean;
    meta?: Record<string, any>;
}

export interface MenuEntity extends BaseEntity {
    label: string;
    path?: string;
    icon?: string;
    is_active: boolean;
    sort_order?: number;
    parent_id?: number | string;
}

export interface RoleEntity extends BaseEntity {
    name: string;
    slug: string;
    description?: string;
}

export interface PermissionEntity extends BaseEntity {
    key: string;
    description?: string;
}

/**Pivots*/

export interface RolePermissionEntity extends BaseEntity {
    role_id: BaseIdType;
    permission_id: BaseIdType;
}

export interface UserRoleEntity extends BaseEntity {
    user_id: BaseIdType;
    role_id: BaseIdType;
}

export interface UserPermissionEntity extends BaseEntity {
    user_id: BaseIdType;
    permission_id: BaseIdType;
}

export interface UserMenuEntity extends BaseEntity {
    user_id: BaseIdType;
    menu_id: BaseIdType;
}