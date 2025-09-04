import type {BaseIdType, MenuEntity, PermissionEntity, RoleEntity} from "@/infrastructure/localDb/entities.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import {db} from "@/infrastructure/localDb/db.ts";
import {ensurePivot, nowIso} from "@/infrastructure/localDb/utils.ts";
import {ResponseAdapter} from "@/infrastructure/localDb/adapters/ResponseAdapter.ts";
import type {IRole} from "@/api/models/Roles.interface.ts";
import {RoleAdapter} from "@/infrastructure/localDb/adapters/RoleAdapter.ts";
import type {IPermission} from "@/api/models/Permissions.interface.ts";
import {PermissionAdapter} from "@/infrastructure/localDb/adapters/PermissionAdapter.ts";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import {MenuAdapter} from "@/infrastructure/localDb/adapters/MenuAdapter.ts";

export class UserRelationshipsService {

    async attachRoles(user_id: BaseIdType, role_ids: BaseIdType[]): Promise<IApiSuccess<null>> {
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
            return ResponseAdapter.toResponse(null, 200, 'Roles attached to user');
        } catch (error) {
            console.error('Error attaching roles to user:', error);
            throw error;
        }
    }

    async detachRoles(user_id: BaseIdType, role_ids: BaseIdType[]): Promise<IApiSuccess<null>> {
        try {
            const user = await db.users.get(user_id);
            if (!user) throw new Error('User not found');

            for (const role_id of role_ids) {
                const existing = await db.user_roles.where(['user_id', 'role_id']).equals([user_id, role_id]).first();
                if (existing)
                    await db.user_roles.delete(existing.id!);
            }
            return ResponseAdapter.toResponse(null, 200, 'Roles detached from user');
        } catch (error) {
            console.error('Error detaching roles from user:', error);
            throw error;
        }
    }

    async getRoles(user_id: BaseIdType): Promise<IApiSuccess<IRole[]>> {
        try {
            const pivots = await db.user_roles.where('user_id').equals(user_id).toArray();
            const roles = await Promise.all(pivots.map(pivot => db.roles.get(pivot.role_id)));
            const filteredRoles = roles.filter((role): role is RoleEntity => role !== undefined);
            const domain = filteredRoles.map(role => (RoleAdapter.toDomain(role)));
            return ResponseAdapter.toResponse(domain, 200, 'User roles retrieved');
        } catch (error) {
            console.error('Error retrieving roles for user:', error);
            throw error;
        }
    }

    async attachPermissions(user_id: BaseIdType, permission_ids: BaseIdType[]): Promise<IApiSuccess<null>> {
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
            return ResponseAdapter.toResponse(null, 200, 'Permissions attached to user');
        } catch (error) {
            console.error('Error attaching permissions to user:', error);
            throw error;
        }
    }

    async detachPermissions(user_id: BaseIdType, permission_ids: BaseIdType[]): Promise<IApiSuccess<null>> {
        try {
            const user = await db.users.get(user_id);
            if (!user) throw new Error('User not found');

            for (const permission_id of permission_ids) {
                const existing = await db.user_permissions.where(['user_id', 'permission_id']).equals([user_id, permission_id]).first();
                if (existing)
                    await db.user_permissions.delete(existing.id!);
            }
            return ResponseAdapter.toResponse(null, 200, 'Permissions detached from user');
        } catch (error) {
            console.error('Error detaching permissions from user:', error);
            throw error;
        }
    }

    async getDirectPermissions(user_id: BaseIdType): Promise<IApiSuccess<IPermission[]>> {
        try {
            const pivots = await db.user_permissions.where('user_id').equals(user_id).toArray();
            const permissions = await Promise.all(pivots.map(pivot => db.permissions.get(pivot.permission_id)));
            const filteredPermissions = permissions.filter((perm): perm is PermissionEntity => perm !== undefined);
            const domain = filteredPermissions.map(permission => (PermissionAdapter.toDomain(permission)));
            return ResponseAdapter.toResponse(domain, 200, 'User direct permissions retrieved');
        } catch (error) {
            console.error('Error retrieving direct permissions for user:', error);
            throw error;
        }
    }

    async getEffectivePermissions(user_id: BaseIdType): Promise<IApiSuccess<IPermission[]>> {
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
            const domain = filteredPermissions.map(permission => (PermissionAdapter.toDomain(permission)));
            return ResponseAdapter.toResponse(domain, 200, 'User effective permissions retrieved');
        } catch (error) {
            console.error('Error retrieving effective permissions for user:', error);
            throw error;
        }
    }

    async attachMenus(user_id: BaseIdType, menu_ids: BaseIdType[]): Promise<IApiSuccess<null>> {
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

            return ResponseAdapter.toResponse(null, 200, 'Menus attached to user');
        } catch (error) {
            console.error('Error attaching menus to user:', error);
            throw error;
        }
    }

    async detachMenus(user_id: BaseIdType, menu_ids: BaseIdType[]): Promise<IApiSuccess<null>> {
        try {
            const user = await db.users.get(user_id);
            if (!user) throw new Error('User not found');

            for (const menu_id of menu_ids) {
                const existing = await db.user_menus.where(['user_id', 'menu_id']).equals([user_id, menu_id]).first();
                if (existing)
                    await db.user_menus.delete(existing.id!);
            }
            return ResponseAdapter.toResponse(null, 200, 'Menus detached from user');
        } catch (error) {
            console.error('Error detaching menus from user:', error);
            throw error;
        }
    }

    async getMenus(user_id: BaseIdType): Promise<IApiSuccess<IMenuItem[]>> {
        try {
            const pivots = await db.user_menus.where('user_id').equals(user_id).toArray();
            const menus = await Promise.all(pivots.map(pivot => db.menus.get(pivot.menu_id)));
            const filteredMenus = menus.filter((menu): menu is MenuEntity => menu !== undefined);
            const domain = filteredMenus.map(menu => (MenuAdapter.toDomain(menu)));
            return ResponseAdapter.toResponse(domain, 200, 'User menus retrieved');
        } catch (error) {
            console.error('Error retrieving menus for user:', error);
            throw error;
        }
    }
}