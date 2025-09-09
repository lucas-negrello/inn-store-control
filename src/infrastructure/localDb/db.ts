import Dexie, { type Table } from 'dexie';
import type {
    AuthTokenEntity,
    BaseIdType,
    MenuEntity,
    PermissionEntity,
    RoleEntity,
    RolePermissionEntity,
    UserEntity, UserMenuEntity, UserPermissionEntity, UserRoleEntity
} from "@/infrastructure/localDb/entities.ts";

export class Db extends Dexie {
    users!: Table<UserEntity, BaseIdType>;
    menus!: Table<MenuEntity, BaseIdType>;
    roles!: Table<RoleEntity, BaseIdType>;
    permissions!: Table<PermissionEntity, BaseIdType>;
    role_permissions!: Table<RolePermissionEntity, BaseIdType>;
    user_roles!: Table<UserRoleEntity, BaseIdType>;
    user_permissions!: Table<UserPermissionEntity, BaseIdType>;
    user_menus!: Table<UserMenuEntity, BaseIdType>;
    auth_tokens!: Table<AuthTokenEntity, BaseIdType>;

    constructor() {
        super('innStoreLocalDB');

        const v1Stores = {
            users: '++id, &email, is_active, created_at',
            menus: '++id, is_active, parent_id, sort_order, label',
            roles: '++id, &slug, name, created_at',
            permissions: '++id, &key, created_at',
            role_permissions: '++id, &[role_id+permission_id], role_id, permission_id',
            user_roles: '++id, &[user_id+role_id], user_id, role_id',
            user_permissions: '++id, &[user_id+permission_id], user_id, permission_id',
            user_menus: '++id, &[user_id+menu_id], user_id, menu_id',
        };

        const v2Stores = {
            ...v1Stores,
            auth_tokens: '++id, token, user_id, expires_at, refresh_token',
        }

        this.version(1).stores(v1Stores);

        this.version(2).stores(v2Stores).upgrade(async (tx) => {
            // If needed to migrate data further
        });
    }
}

export const db = new Db();