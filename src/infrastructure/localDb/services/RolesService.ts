import type {IRole} from "@/api/models/Roles.interface.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import type {BaseIdType, RoleEntity} from "@/infrastructure/localDb/entities.ts";
import {db} from "@/infrastructure/localDb/db.ts";
import {RoleAdapter} from "@/infrastructure/localDb/adapters/RoleAdapter.ts";
import {ResponseAdapter} from "@/infrastructure/localDb/adapters/ResponseAdapter.ts";
import {nowIso} from "@/infrastructure/localDb/utils.ts";
import {RoleRelationshipsService} from "@/infrastructure/localDb/services/RoleRelationshipsService.ts";


export class RolesService
    extends RoleRelationshipsService {
    async create(data: IRole): Promise<IApiSuccess<IRole>> {
        try {
            const entity = RoleAdapter.toEntity(data);

            const id = await db.roles.add(entity);
            const created = await db.roles.get(id);

            const domain = RoleAdapter.toDomain(created!);
            return ResponseAdapter.toResponse(domain, 201);
        } catch (error) {
            console.error('Error creating role:', error);
            throw error;
        }
    }

    async update(id: BaseIdType, data: Partial<IRole>): Promise<IApiSuccess<IRole>> {
        try {
            const current: RoleEntity | undefined = await db.roles.get(id);
            if (!current) throw new Error('Role not found');

            const role: IRole = RoleAdapter.toDomain(current);
            const mergedRole: IRole = {...role, ...data};
            const entity: RoleEntity = RoleAdapter.toEntity(mergedRole);
            const merged: RoleEntity = {...current, ...entity, updated_at: nowIso()};

            await db.roles.put(merged);

            const updated = await db.roles.get(id);
            const domain = RoleAdapter.toDomain(updated!);

            return ResponseAdapter.toResponse(domain);
        } catch (error) {
            console.error('Error updating role:', error);
            throw error;
        }
    }

    async delete(id: BaseIdType): Promise<IApiSuccess<null>> {
        try {
            await Promise.all([
                db.roles.delete(id),
                db.user_roles.where('role_id').equals(id).delete(),
                db.role_permissions.where('role_id').equals(id).delete(),
            ]);
            return ResponseAdapter.toResponse(null, 200, 'Role deleted');
        } catch (error) {
            console.error('Error deleting role:', error);
            throw error;
        }
    }

    async findById(id: BaseIdType): Promise<IApiSuccess<IRole>> {
        try {
            const entity = await db.roles.get(id);
            if (!entity) throw new Error('Role not found');

            const domain = RoleAdapter.toDomain(entity);
            return ResponseAdapter.toResponse(domain, 200);
        } catch (error) {
            console.error('Error finding role by ID:', error);
            throw error;
        }
    }

    async findBySlug(slug: string): Promise<IApiSuccess<IRole>> {
        try {
            const entity = await db.roles.where('slug').equals(slug).first();
            if (!entity) throw new Error('Role not found');

            const domain = RoleAdapter.toDomain(entity);
            return ResponseAdapter.toResponse(domain, 200);
        } catch (error) {
            console.error('Error finding role by slug:', error);
            throw error;
        }
    }

    async list(): Promise<IApiSuccess<IRole[]>> {
        try {
            const entities = await db.roles.toArray();
            const domain = entities.map(RoleAdapter.toDomain);
            return ResponseAdapter.toResponse(domain, 200);
        } catch (error) {
            console.error('Error listing roles:', error);
            throw error;
        }
    }
}