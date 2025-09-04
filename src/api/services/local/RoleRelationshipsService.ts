import type {BaseIdType, PermissionEntity} from "@/infrastructure/localDb/entities.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import {db} from "@/infrastructure/localDb/db.ts";
import {ensurePivot, nowIso} from "@/infrastructure/localDb/utils.ts";
import {ResponseAdapter} from "@/infrastructure/localDb/adapters/ResponseAdapter.ts";
import type {IPermission} from "@/api/models/Permissions.interface.ts";
import {PermissionAdapter} from "@/infrastructure/localDb/adapters/PermissionAdapter.ts";

export class RoleRelationshipsService {
    async attachPermissions(role_id: BaseIdType, permission_ids: BaseIdType[]): Promise<IApiSuccess<null>> {
        try {
            const role = await db.roles.get(role_id);
            if (!role) throw new Error('Role not found');

            for (const permission_id of permission_ids) {
                await ensurePivot(
                    db.role_permissions,
                    async () => db.role_permissions.where(['role_id', 'permission_id']).equals([role_id, permission_id]).first(),
                    async () => db.role_permissions.add({ role_id, permission_id, created_at: nowIso(), updated_at: nowIso() })
                );
            }

            return ResponseAdapter.toResponse(null, 200, 'Permissions attached to role');
        } catch (error) {
            console.error('Error attaching permissions to role:', error);
            throw error;
        }
    }

    async detachPermissions(role_id: BaseIdType, permission_ids: BaseIdType[]): Promise<IApiSuccess<null>> {
        try {
            const role = await db.roles.get(role_id);
            if (!role) throw new Error('Role not found');

            for (const permission_id of permission_ids) {
                const existing = await db.role_permissions.where(['role_id', 'permission_id']).equals([role_id, permission_id]).first();
                if (existing)
                    await db.role_permissions.delete(existing.id!);
            }

            return ResponseAdapter.toResponse(null, 200, 'Permissions detached from role');
        } catch (error) {
            console.error('Error detaching permissions from role:', error);
            throw error;
        }
    }

    async getPermissions(role_id: BaseIdType): Promise<IApiSuccess<IPermission[]>> {
        try {
            const pivots = await db.role_permissions.where('role_id').equals(role_id).toArray();
            const permissions = await Promise.all(pivots.map(pivot => db.permissions.get(pivot.permission_id)));
            const filteredPermissions = permissions.filter((perm): perm is PermissionEntity => perm !== undefined);
            const domain = filteredPermissions.map((perm) => PermissionAdapter.toDomain(perm));
            return ResponseAdapter.toResponse(domain, 200, 'Role permissions retrieved');
        } catch (error) {
            console.error('Error retrieving permissions for role:', error);
            throw error;
        }
    }
}