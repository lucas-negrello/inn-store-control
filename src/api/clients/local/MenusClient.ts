import type {LocalClientStrategy} from "@/api/clients/base/LocalClientStrategy.ts";
import type { IApiSuccess } from "@/api/interfaces/ApiResponse.interface";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import type {BaseIdType} from "@/infrastructure/localDb/entities.ts";
import {MenuAdapter} from "@/infrastructure/localDb/adapters/MenuAdapter.ts";
import {db} from "@/infrastructure/localDb/db.ts";
import {ResponseAdapter} from "@/infrastructure/localDb/adapters/ResponseAdapter.ts";

export class MenusClientLocal implements LocalClientStrategy<IMenuItem> {
    async create(data: IMenuItem): Promise<IApiSuccess<IMenuItem>> {
        try {
            const entity = MenuAdapter.toEntity(data);

            const id = await db.menus.add(entity);
            const created = await db.menus.get(id);

            const domain = MenuAdapter.toDomain(created!);

            return ResponseAdapter.toResponse(domain, 201);
        } catch (error) {
            console.error('Error creating menu item:', error);
            throw error;
        }
    }
    async update(id: BaseIdType, data: Partial<IMenuItem>): Promise<IApiSuccess<IMenuItem>> {
        try {
            const current = await db.menus.get(id);
            if (!current) throw new Error('Menu item not found');

            const menuItem = MenuAdapter.toDomain(current);
            const mergedMenuItem = {...menuItem, ...data};
            const entity = MenuAdapter.toEntity(mergedMenuItem);
            const merged = {...current, ...entity};

            await db.menus.put(merged);

            const updated = await db.menus.get(id);
            const domain = MenuAdapter.toDomain(updated!);

            return ResponseAdapter.toResponse(domain);
        } catch (error) {
            console.error('Error updating menu item:', error);
            throw error;
        }
    }
    async delete(id: BaseIdType): Promise<IApiSuccess<null>> {
        try {
            const children = await db.menus.where('parent_id').equals(id).toArray();
            for (const child of children) {
                await this.delete(child.id!);
            }
            await db.menus.delete(id);

            return ResponseAdapter.toResponse(null, 200, 'Menu item deleted');
        } catch (error) {
            console.error('Error deleting menu item:', error);
            throw error;
        }
    }
    async list(): Promise<IApiSuccess<IMenuItem[]>> {
        try {
            const entities = await db.menus.toArray();
            const domain = entities.map(MenuAdapter.toDomain);
            return ResponseAdapter.toResponse(domain);
        } catch (error) {
            console.error('Error listing menu items:', error);
            throw error;
        }
    }
    async findById(id: BaseIdType): Promise<IApiSuccess<IMenuItem>> {
        try {
            const entity = await db.menus.get(id);
            if (!entity) throw new Error('Menu item not found');

            const domain = MenuAdapter.toDomain(entity);
            return ResponseAdapter.toResponse(domain);
        } catch (error) {
            console.error('Error finding menu item by ID:', error);
            throw error;
        }
    }

    async listFlat(withInactive: boolean = false): Promise<IApiSuccess<IMenuItem[]>> {
        try {
            const entities = await db.menus.orderBy('sort_order').toArray();
            const domains = entities.map(MenuAdapter.toDomain).filter(menu => withInactive || menu.isActive);
            return ResponseAdapter.toResponse(domains);
        } catch (error) {
            console.error('Error listing ordered menu items:', error);
            throw error;
        }
    }

    async getTree(withInactive: boolean = false): Promise<IApiSuccess<IMenuItem[]>> {
        try {
            const all = await db.menus.orderBy('sort_order').filter(menu => withInactive || menu.is_active).toArray();
            const map = new Map<BaseIdType, IMenuItem>();
            const roots: IMenuItem[] = [];

            for (const menu of all) {
                const domain = MenuAdapter.toDomain(menu);
                map.set(menu.id!, domain);
            }

            for (const item of map.values()) {
                if (!item.parent_id) {
                    roots.push(item);
                } else {
                    const parent = map.get(item.parent_id);
                    if (!parent) {
                        roots.push(item);
                    } else {
                        parent.children = parent.children || [];
                        parent.children.push(item);
                    }
                }
            }

            const sortRecursive = (nodes: IMenuItem[]) => {
                nodes.sort((a, b) =>
                    (a.sort_order ?? 0) - (b.sort_order ?? 0));
                nodes.forEach(n => n.children && sortRecursive(n.children));
            }

            sortRecursive(roots);

            return ResponseAdapter.toResponse(roots)
        } catch (error) {
            console.error('Error building menu tree:', error);
            throw error;
        }
    }

    async getTreeForUser(user_id: BaseIdType, withInactive: boolean = false): Promise<IApiSuccess<IMenuItem[]>> {
        try {
            const userMenusPivots = await db.user_menus.where('user_id').equals(user_id).toArray();
            const allowedIds = new Set(userMenusPivots.map(um => um.menu_id));
            const all = await db.menus.orderBy('sort_order').filter(menu => withInactive || menu.is_active).toArray();

            const byId = new Map(all.map(m => [m.id!, m]));
            const includeIds = new Set<BaseIdType>();

            for (const id of allowedIds) {
                let current: typeof all[number] | undefined = byId.get(id);
                while (current) {
                    includeIds.add(current.id!);
                    if (current.parent_id) current = byId.get(current.parent_id!);
                    else break;
                }
            }

            const filtered = all.filter(menu => includeIds.has(menu.id!));
            const map = new Map<BaseIdType, IMenuItem>();
            const roots: IMenuItem[] = [];

            for (const menu of filtered) {
                const domain = MenuAdapter.toDomain(menu);
                map.set(menu.id!, domain);
            }

            for (const item of map.values()) {
                if (!item.parent_id) {
                    roots.push(item);
                } else {
                    const parent = map.get(item.parent_id);
                    if (!parent) {
                        roots.push(item);
                    } else {
                        parent.children = parent.children || [];
                        parent.children.push(item);
                    }
                }
            }

            const sortRecursive = (nodes: IMenuItem[]) => {
                nodes.sort((a, b) =>
                    (a.sort_order ?? 0) - (b.sort_order ?? 0));
                nodes.forEach(n => n.children && sortRecursive(n.children));
            }

            sortRecursive(roots);

            return ResponseAdapter.toResponse(roots)
        } catch (error) {
            console.error('Error building menu tree for user:', error);
            throw error;
        }
    }
}