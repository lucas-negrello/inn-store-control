import type {IPermission} from "@/api/models/Permissions.interface.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import type {BaseIdType} from "@/infrastructure/localDb/entities.ts";
import {PermissionAdapter} from "@/infrastructure/localDb/adapters/PermissionAdapter.ts";
import {db} from "@/infrastructure/localDb/db.ts";
import {ResponseAdapter} from "@/infrastructure/localDb/adapters/ResponseAdapter.ts";

export class PermissionsService {
    async create(data: IPermission): Promise<IApiSuccess<IPermission>> {
        try {
            const entity = PermissionAdapter.toEntity(data);

            const id = await db.permissions.add(entity);
            const created = await db.permissions.get(id);

            const domain = PermissionAdapter.toDomain(created!);
            return ResponseAdapter.toResponse(domain, 201);
        } catch (error) {
            console.error('Error creating permission:', error);
            throw error;
        }
    }

    async upsertMany(items: IPermission[]): Promise<IApiSuccess<null>> {
        try {
            const entities = items.map(item => PermissionAdapter.toEntity(item));
            await db.permissions.bulkPut(entities);
            return ResponseAdapter.toResponse(null, 200, 'Permissions upserted successfully');
        } catch (error) {
            console.error('Error upserting permissions:', error);
            throw error;
        }
    }

    async update(id: BaseIdType, data: Partial<IPermission>): Promise<IApiSuccess<IPermission>> {
        try {
            const current = await db.permissions.get(id);
            if (!current) throw new Error('Permission not found');

            const permission = PermissionAdapter.toDomain(current);
            const mergedPermission = {...permission, ...data};
            const entity = PermissionAdapter.toEntity(mergedPermission);
            const merged = {...current, ...entity};

            await db.permissions.put(merged);

            const updated = await db.permissions.get(id);
            const domain = PermissionAdapter.toDomain(updated!);

            return ResponseAdapter.toResponse(domain);
        } catch (error) {
            console.error('Error updating permission:', error);
            throw error;
        }
    }
    async delete(id: BaseIdType): Promise<IApiSuccess<null>> {
        try {
            await Promise.all([
                db.permissions.delete(id),
                db.role_permissions.where('permission_id').equals(id).delete(),
                db.user_permissions.where('permission_id').equals(id).delete(),
            ]);
            return ResponseAdapter.toResponse(null, 200, 'Permission deleted successfully');
        } catch (error) {
            console.error('Error deleting permission:', error);
            throw error;
        }
    }
    async list(): Promise<IApiSuccess<IPermission[]>> {
        try {
            const entities = await db.permissions.toArray();
            const domain = entities.map(entity => PermissionAdapter.toDomain(entity));
            return ResponseAdapter.toResponse(domain, 200, 'Permissions retrieved successfully');
        } catch (error) {
            console.error('Error listing permissions:', error);
            throw error;
        }
    }
    async findById(id: BaseIdType): Promise<IApiSuccess<IPermission>> {
        try {
            const entity = await db.permissions.get(id);
            if (!entity) throw new Error('Permission not found');

            const domain = PermissionAdapter.toDomain(entity);
            return ResponseAdapter.toResponse(domain);
        } catch (error) {
            console.error('Error finding permission by ID:', error);
            throw error;
        }
    }

    async findByKey(key: string): Promise<IApiSuccess<IPermission>> {
        try {
            const entity = await db.permissions.where('key').equals(key).first();
            if (!entity) throw new Error('Permission not found');

            const domain = PermissionAdapter.toDomain(entity);
            return ResponseAdapter.toResponse(domain);
        } catch (error) {
            console.error('Error finding permission by key:', error);
            throw error;
        }
    }
}