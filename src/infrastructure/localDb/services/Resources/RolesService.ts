import type {IRole} from "@/api/models/Roles.interface.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import type {BaseIdType, RoleEntity} from "@/infrastructure/localDb/entities.ts";
import {db} from "@/infrastructure/localDb/db.ts";
import {RoleAdapter} from "@/infrastructure/localDb/adapters/RoleAdapter.ts";
import {ResponseAdapter} from "@/infrastructure/localDb/adapters/ResponseAdapter.ts";
import {nowIso} from "@/infrastructure/localDb/utils/generalUtils.ts";
import {RoleRelationshipsService} from "@/infrastructure/localDb/services/Relationships/RoleRelationshipsService.ts";
import {Env} from "@/config/env.ts";


export class RolesService extends RoleRelationshipsService {

    private readonly _useRelationships = Env.localClientLoadRelations;

    async create(data: IRole): Promise<IApiSuccess<IRole>> {
        try {
            const entity = RoleAdapter.toEntity(data);

            const id = await db.roles.add(entity);
            const created = await db.roles.get(id);

            if (this._useRelationships)
                return ResponseAdapter.toResponse(await RolesService.getRoleWithAllRelationships(id), 201);

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

            if (this._useRelationships)
                return ResponseAdapter.toResponse(await RolesService.getRoleWithAllRelationships(id));

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

            if (this._useRelationships)
                return ResponseAdapter.toResponse(await RolesService.getRoleWithAllRelationships(id));

            const domain = RoleAdapter.toDomain(entity);
            return ResponseAdapter.toResponse(domain, 200);
        } catch (error) {
            console.error('Error finding role by ID:', error);
            throw error;
        }
    }

    async list(): Promise<IApiSuccess<IRole[]>> {
        try {
            const entities = await db.roles.toArray();
            const domain = entities.map(RoleAdapter.toDomain);

            if (this._useRelationships) {
                const roleWithRelations: IRole[] = [];
                for (const entity of entities)
                    roleWithRelations.push(await RolesService.getRoleWithAllRelationships(entity.id!));

                return ResponseAdapter.toResponse(roleWithRelations, 200);
            }

            return ResponseAdapter.toResponse(domain, 200);
        } catch (error) {
            console.error('Error listing roles:', error);
            throw error;
        }
    }

    static async findBySlug(slug: string): Promise<IApiSuccess<IRole>> {
        try {
            const entity = await db.roles.where('slug').equals(slug).first();
            if (!entity) throw new Error('Role not found');

            if (Env.localClientLoadRelations)
                return ResponseAdapter.toResponse(await RolesService.getRoleWithAllRelationships(entity.id!));

            const domain = RoleAdapter.toDomain(entity);
            return ResponseAdapter.toResponse(domain, 200);
        } catch (error) {
            console.error('Error finding role by slug:', error);
            throw error;
        }
    }
}