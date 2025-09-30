import type {BaseIdType, PermissionEntity} from "@/infrastructure/localDb/entities.ts";
import {db} from "@/infrastructure/localDb/db.ts";
import {ensurePivot, nowIso} from "@/infrastructure/localDb/utils/generalUtils.ts";
import type {IPermission} from "@/api/models/Permissions.interface.ts";
import {PermissionAdapter} from "@/infrastructure/localDb/adapters/PermissionAdapter.ts";
import type {IRole} from "@/api/models/Roles.interface.ts";
import {RoleAdapter} from "@/infrastructure/localDb/adapters/RoleAdapter.ts";

export class RoleRelationshipsService {
    static async getRoleWithAllRelationships(role_id: BaseIdType): Promise<IRole> {
        try {
            const role = await db.roles.get(+role_id);
            if (!role) throw new Error('Role not found');

            const [ permissions ] = await Promise.all([
                this.getPermissions(+role_id),
            ]);

            const domain = RoleAdapter.toDomain(role);
            return {
                ...domain,
                permissions,
            }
        } catch (error) {
            console.error('Error retrieving role with relationships:', error);
            throw error;
        }
    }

    static async attachPermissions(role_id: BaseIdType, permission_ids: BaseIdType[]): Promise<BaseIdType[]> {
        try {
            const role = await db.roles.get(+role_id);
            if (!role) throw new Error('Role not found');

            for (const permission_id of permission_ids) {
                await ensurePivot(
                    db.role_permissions,
                    async () => db.role_permissions.where(['role_id', 'permission_id']).equals([+role_id, +permission_id]).first(),
                    async () => db.role_permissions.add({ role_id, permission_id, created_at: nowIso(), updated_at: nowIso() })
                );
            }

            return permission_ids;
        } catch (error) {
            console.error('Error attaching permissions to role:', error);
            throw error;
        }
    }

    static async detachPermissions(role_id: BaseIdType, permission_ids: BaseIdType[]): Promise<BaseIdType[]> {
        try {
            const role = await db.roles.get(+role_id);
            if (!role) throw new Error('Role not found');

            for (const permission_id of permission_ids) {
                const existing = await db.role_permissions.where(['role_id', 'permission_id']).equals([+role_id, +permission_id]).first();
                if (existing)
                    await db.role_permissions.delete(existing.id!);
            }

            return permission_ids;
        } catch (error) {
            console.error('Error detaching permissions from role:', error);
            throw error;
        }
    }

    static async getPermissions(role_id: BaseIdType): Promise<IPermission[]> {
        try {
            const pivots = await db.role_permissions.where('role_id').equals(+role_id).toArray();
            const permissions = await Promise.all(pivots.map(pivot => db.permissions.get(pivot.permission_id)));
            const filteredPermissions = permissions.filter((perm): perm is PermissionEntity => perm !== undefined);
            return filteredPermissions.map((perm) => PermissionAdapter.toDomain(perm));
        } catch (error) {
            console.error('Error retrieving permissions for role:', error);
            throw error;
        }
    }
}