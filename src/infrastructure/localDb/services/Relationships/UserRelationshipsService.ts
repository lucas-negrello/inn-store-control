import type {BaseIdType, MenuEntity, PermissionEntity, RoleEntity} from "@/infrastructure/localDb/entities.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import {db} from "@/infrastructure/localDb/db.ts";
import {ensurePivot, nowIso} from "@/infrastructure/localDb/utils/generalUtils.ts";
import {ResponseAdapter} from "@/infrastructure/localDb/adapters/ResponseAdapter.ts";
import type {IRole} from "@/api/models/Roles.interface.ts";
import {RoleAdapter} from "@/infrastructure/localDb/adapters/RoleAdapter.ts";
import type {IPermission} from "@/api/models/Permissions.interface.ts";
import {PermissionAdapter} from "@/infrastructure/localDb/adapters/PermissionAdapter.ts";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import {MenuAdapter} from "@/infrastructure/localDb/adapters/MenuAdapter.ts";
import type {IUser} from "@/api/models/Users.interface.ts";
import {UserAdapter} from "@/infrastructure/localDb/adapters/UserAdapter.ts";

export class UserRelationshipsService {

    static async getUserWithAllRelationships(user_id: BaseIdType): Promise<IUser> {
        try {
            const user = await db.users.get(user_id);
            if (!user) throw new Error('User not found');

            const [ roles, directPermissions, effectivePermissions, menus ] = await Promise.all([
                this.getRoles(user_id),
                this.getDirectPermissions(user_id),
                this.getEffectivePermissions(user_id),
                this.getMenus(user_id)
            ]);

            const permissions = [...directPermissions, ...effectivePermissions];

            const domain = UserAdapter.toUserSafe(user);
            return {
                ...domain,
                roles,
                permissions,
                menus,
            };
        } catch (error) {
            console.error('Error attaching roles to user:', error);
            throw error;
        }
    }

    static async attachRoles(user_id: BaseIdType, role_ids: BaseIdType[]): Promise<BaseIdType[]> {
        try {
            const user = await db.users.get(user_id);
            if (!user) throw new Error('User not found');

            for (const role_id of role_ids) {
                await ensurePivot(
                    db.user_roles,
                    async () => db.user_roles.where(['user_id', 'role_id']).equals([user_id, role_id]).first(),
                    async () => db.user_roles.add({ user_id, role_id, created_at: nowIso(), updated_at: nowIso() })
                );
            }
            return role_ids;
        } catch (error) {
            console.error('Error attaching roles to user:', error);
            throw error;
        }
    }

    static async detachRoles(user_id: BaseIdType, role_ids: BaseIdType[]): Promise<BaseIdType[]> {
        try {
            const user = await db.users.get(user_id);
            if (!user) throw new Error('User not found');

            for (const role_id of role_ids) {
                const existing = await db.user_roles.where(['user_id', 'role_id']).equals([user_id, role_id]).first();
                if (existing)
                    await db.user_roles.delete(existing.id!);
            }
            return role_ids;
        } catch (error) {
            console.error('Error detaching roles from user:', error);
            throw error;
        }
    }

    static async getRoles(user_id: BaseIdType): Promise<IRole[]> {
        try {
            const pivots = await db.user_roles.where('user_id').equals(user_id).toArray();
            const roles = await Promise.all(pivots.map(pivot => db.roles.get(pivot.role_id)));
            const filteredRoles = roles.filter((role): role is RoleEntity => role !== undefined);
            return filteredRoles.map(role => (RoleAdapter.toDomain(role)));
        } catch (error) {
            console.error('Error retrieving roles for user:', error);
            throw error;
        }
    }

    static async attachPermissions(user_id: BaseIdType, permission_ids: BaseIdType[]): Promise<BaseIdType[]> {
        try {
            const user = await db.users.get(user_id);
            if (!user) throw new Error('User not found');

            for (const permission_id of permission_ids) {
                await ensurePivot(
                    db.user_permissions,
                    async () => db.user_permissions.where(['user_id', 'permission_id']).equals([user_id, permission_id]).first(),
                    async () => db.user_permissions.add({ user_id, permission_id, created_at: nowIso(), updated_at: nowIso() })
                );
            }
            return permission_ids;
        } catch (error) {
            console.error('Error attaching permissions to user:', error);
            throw error;
        }
    }

    static async detachPermissions(user_id: BaseIdType, permission_ids: BaseIdType[]): Promise<BaseIdType[]> {
        try {
            const user = await db.users.get(user_id);
            if (!user) throw new Error('User not found');

            for (const permission_id of permission_ids) {
                const existing = await db.user_permissions.where(['user_id', 'permission_id']).equals([user_id, permission_id]).first();
                if (existing)
                    await db.user_permissions.delete(existing.id!);
            }
            return permission_ids;
        } catch (error) {
            console.error('Error detaching permissions from user:', error);
            throw error;
        }
    }

    static async getDirectPermissions(user_id: BaseIdType): Promise<IPermission[]> {
        try {
            const pivots = await db.user_permissions.where('user_id').equals(user_id).toArray();
            const permissions = await Promise.all(pivots.map(pivot => db.permissions.get(pivot.permission_id)));
            const filteredPermissions = permissions.filter((perm): perm is PermissionEntity => perm !== undefined);
            return filteredPermissions.map(permission => (PermissionAdapter.toDomain(permission)));
        } catch (error) {
            console.error('Error retrieving direct permissions for user:', error);
            throw error;
        }
    }

    static async getEffectivePermissions(user_id: BaseIdType): Promise<IPermission[]> {
        try {
            const rolePivots = await db.user_roles.where('user_id').equals(user_id).toArray();
            const roleIds = rolePivots.map(pivot => pivot.role_id);
            const rolePermissionPivots = await db.role_permissions.where('role_id').anyOf(roleIds).toArray();

            const directPermissionPivots = await db.user_permissions.where('user_id').equals(user_id).toArray();

            const permIds = new Set<BaseIdType>([
                ...rolePermissionPivots.map(rp => rp.permission_id),
                ...directPermissionPivots.map(dp => dp.permission_id)
            ]);

            const permEntities = await db.permissions.bulkGet([...permIds]);
            const filteredPermissions = permEntities.filter((perm): perm is PermissionEntity => perm !== undefined)
            return filteredPermissions.map(permission => (PermissionAdapter.toDomain(permission)));
        } catch (error) {
            console.error('Error retrieving effective permissions for user:', error);
            throw error;
        }
    }

    static async attachMenus(user_id: BaseIdType, menu_ids: BaseIdType[]): Promise<BaseIdType[]> {
        try {
            const user = await db.users.get(user_id);
            if (!user) throw new Error('User not found');

            for (const menu_id of menu_ids) {
                await ensurePivot(
                    db.user_menus,
                    async () => db.user_menus.where(['user_id', 'menu_id']).equals([user_id, menu_id]).first(),
                    async () => db.user_menus.add({ user_id, menu_id, created_at: nowIso(), updated_at: nowIso() })
                );
            }

            return menu_ids;
        } catch (error) {
            console.error('Error attaching menus to user:', error);
            throw error;
        }
    }

    static async detachMenus(user_id: BaseIdType, menu_ids: BaseIdType[]): Promise<BaseIdType[]> {
        try {
            const user = await db.users.get(user_id);
            if (!user) throw new Error('User not found');

            for (const menu_id of menu_ids) {
                const existing = await db.user_menus.where(['user_id', 'menu_id']).equals([user_id, menu_id]).first();
                if (existing)
                    await db.user_menus.delete(existing.id!);
            }
            return menu_ids;
        } catch (error) {
            console.error('Error detaching menus from user:', error);
            throw error;
        }
    }

    static async getMenus(user_id: BaseIdType): Promise<IMenuItem[]> {
        try {
            const pivots = await db.user_menus.where('user_id').equals(user_id).toArray();
            const menus = await Promise.all(pivots.map(pivot => db.menus.get(pivot.menu_id)));
            const filteredMenus = menus.filter((menu): menu is MenuEntity => menu !== undefined);
            return filteredMenus.map(menu => (MenuAdapter.toDomain(menu)));
        } catch (error) {
            console.error('Error retrieving menus for user:', error);
            throw error;
        }
    }
}