import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import type {MenuEntity} from "@/infrastructure/localDb/entities.ts";

export const MenuAdapter = {
    toEntity(domain: IMenuItem): MenuEntity {
        return {
            id: domain.id,
            label: domain.label,
            path: domain.route,
            icon: domain.icon,
            is_active: domain.isActive,
            parent_id: domain.parent_id,
            sort_order: domain.sort_order,
            created_at: domain.created_at,
            updated_at: domain.updated_at,
        }
    },

    toDomain(entity: MenuEntity): IMenuItem {
        return {
            id: entity.id,
            label: entity.label,
            route: entity.path || '',
            icon: entity.icon,
            isActive: entity.is_active,
            parent_id: entity.parent_id,
            sort_order: entity.sort_order,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
        }
    }
}