import type {IUser, IUserMeta} from "@/api/models/Users.interface.ts";
import type {UserEntity} from "@/infrastructure/localDb/entities.ts";

export const UserAdapter = {
    toEntity(domain: IUser, passwordHash?: string): UserEntity {
        return {
            id: domain.id,
            email: domain.email,
            name: domain.username,
            password_hash: passwordHash,
            meta: domain.meta,
            is_active: domain.isActive,
            created_at: domain.created_at,
            updated_at: domain.updated_at,
            deleted_at: domain.deleted_at,
        }
    },

    toDomain(entity: UserEntity): IUser {
        return {
            id: entity.id,
            email: entity.email,
            username: entity.name,
            isActive: entity.is_active,
            meta: entity.meta as Partial<IUserMeta>,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            deleted_at: entity.deleted_at,
            password: entity.password_hash,
        }
    }
}