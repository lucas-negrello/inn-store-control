import type {IRole} from "@/api/models/Roles.interface.ts";
import type {RoleEntity} from "@/infrastructure/localDb/entities.ts";

export const RoleAdapter = {
    toEntity(domain: IRole): RoleEntity {
        return {
            id: domain.id,
            name: domain.name,
            slug: domain.slug,
            description: domain.description,
            created_at: domain.created_at,
            updated_at: domain.updated_at,
        }
    },

    toDomain(entity: RoleEntity): IRole {
        return {
            id: entity.id,
            name: entity.name,
            slug: entity.slug,
            description: entity.description,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
        }
    }
}