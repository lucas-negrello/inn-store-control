import type {IPermission} from "@/api/models/Permissions.interface.ts";
import type {PermissionEntity} from "@/infrastructure/localDb/entities.ts";

export const PermissionAdapter = {
    toEntity(domain: IPermission): PermissionEntity {
        return {
            id: domain.id,
            key: domain.key,
            description: domain.description,
            created_at: domain.created_at,
            updated_at: domain.updated_at,
        }
    },

    toDomain(entity: PermissionEntity): IPermission {
        return {
            id: entity.id,
            key: entity.key,
            description: entity.description,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
        }
    }
}