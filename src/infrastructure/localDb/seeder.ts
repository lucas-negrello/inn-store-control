import {db} from "@/infrastructure/localDb/db.ts";
import type {IPermission} from "@/api/models/Permissions.interface.ts";
import type {IRole} from "@/api/models/Roles.interface.ts";
import type {IUser} from "@/api/models/Users.interface.ts";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import {firstOrCreate, nowIso} from "@/infrastructure/localDb/utils.ts";
import {PermissionAdapter} from "@/infrastructure/localDb/adapters/PermissionAdapter.ts";
import {RoleAdapter} from "@/infrastructure/localDb/adapters/RoleAdapter.ts";
import {MenuAdapter} from "@/infrastructure/localDb/adapters/MenuAdapter.ts";
import {UserAdapter} from "@/infrastructure/localDb/adapters/UserAdapter.ts";
import type {
    RolePermissionEntity,
    UserPermissionEntity,
    UserRoleEntity
} from "@/infrastructure/localDb/entities.ts";

type MockPermissions = Pick<IPermission, 'key' | 'description'>;
type MockRoles = Pick<IRole, 'slug' | 'name'>;
type MockUsers = Pick<IUser, 'username' | 'email'>;
interface MockMenu extends Pick<IMenuItem, 'label' | 'route' | 'sort_order'> {
    parent_label?: string;
}
interface MockRolePermissions {
    role_slug: string;
    permission_key: string;
}
interface MockUserRoles {
    user_email: string;
    role_slug: string;
}
interface MockUserPermissions {
    user_email: string;
    permission_key: string;
}
interface MockUserMenus {
    user_email: string;
    menu_path: string;
}

export async function seedLocalDbFromMocks() {
    const userCount = await db.users.count();

    if (userCount > 0) return;

    const tables = [
        db.users,
        db.roles,
        db.permissions,
        db.menus,
        db.user_roles,
        db.role_permissions,
        db.user_permissions,
        db.user_menus
    ]

    await db.transaction('rw', tables, async () => {
        const permissions: MockPermissions[] = await import('@/assets/mock/local/permissions.json');
        const roles: MockRoles[] = await import('@/assets/mock/local/roles.json');
        const users: MockUsers[] = await import('@/assets/mock/local/users.json');
        const menus: MockMenu[] = await import('@/assets/mock/local/menus.json');
        const rolePermissions: MockRolePermissions[] = await import('@/assets/mock/local/role_permissions.json');
        const userRoles: MockUserRoles[] = await import('@/assets/mock/local/user_roles.json');
        const userPermissions: MockUserPermissions[] = await import('@/assets/mock/local/user_permissions.json');
        const userMenus: MockUserMenus[] = await import('@/assets/mock/local/user_menus.json');

        if (permissions && permissions.length > 0) {
            for (const permission of permissions) {
                const entity = PermissionAdapter.toEntity(permission);
                await firstOrCreate(db.permissions, 'key', entity.key, {...entity, created_at: nowIso(), updated_at: nowIso()}, { override: true });
            }
        }

        if (roles && roles.length > 0) {
            for (const role of roles) {
                const entity = RoleAdapter.toEntity(role);
                await firstOrCreate(db.roles, 'slug', entity.slug, {...entity, created_at: nowIso(), updated_at: nowIso()}, { override: true });
            }
        }

        const recursiveMenuGenerator = async (menu?: MockMenu) => {
            if (menu && menu.parent_label) {
                const parentMenu = await db.menus.where('label').equals(menu.parent_label).first();
                if (parentMenu) {
                    const entity = MenuAdapter.toEntity({...menu, isActive: true, parent_id: parentMenu.id});
                    await firstOrCreate(db.menus, 'label', entity.label, {...entity, created_at: nowIso(), updated_at: nowIso()}, { override: true });
                } else {
                    const parent = menus.find(m => m.label === menu.parent_label);
                    if (parent) {
                        await recursiveMenuGenerator(parent);
                    } else {
                        throw new Error('Parent menu not found');
                    }
                }
            }
            if (menu && !menu.parent_label) {
                const entity = MenuAdapter.toEntity({...menu, isActive: true});
                await firstOrCreate(db.menus, 'label', entity.label, {...entity, created_at: nowIso(), updated_at: nowIso()}, { override: true });
            }
        };


        if (menus && menus.length > 0) {
            for (const menu of menus) {
                await recursiveMenuGenerator(menu);
            }
        }

        if (users && users.length > 0) {
            for (const user of users) {
                const entity = UserAdapter.toEntity({...user, isActive: true});
                await firstOrCreate(db.users, 'email', entity.email, {...entity, created_at: nowIso(), updated_at: nowIso()}, { override: true });
            }
        }

        const roleEntities = await db.roles.toArray();
        const permissionEntities = await db.permissions.toArray();
        const userEntities = await db.users.toArray();
        const menuEntities = await db.menus.toArray();

        if (rolePermissions && rolePermissions.length > 0) {
            for (const rp of rolePermissions) {
                const role = roleEntities.find(role => role.slug === rp.role_slug);
                const permission = permissionEntities.find(permission => permission.key === rp.permission_key);

                if (!role || !permission) continue;

                const rolePermissionEntity: RolePermissionEntity = {
                    role_id: role.id!,
                    permission_id: permission.id!
                };

                await firstOrCreate(db.role_permissions, '[role_id+permission_id]', [role.id!, permission.id!], {...rolePermissionEntity, created_at: nowIso(), updated_at: nowIso()}, { override: true });
            }
        }

        if (userRoles && userRoles.length > 0) {
            for (const ur of userRoles) {
                const user = userEntities.find(user => user.email === ur.user_email);
                const role = roleEntities.find(role => role.slug === ur.role_slug);

                if (!user || !role) continue;

                const userRoleEntity: UserRoleEntity = {
                    user_id: user.id!,
                    role_id: role.id!
                };

                await firstOrCreate(db.user_roles, '[user_id+role_id]', [user.id!, role.id!], {...userRoleEntity, created_at: nowIso(), updated_at: nowIso()}, { override: true });
            }
        }

        if (userPermissions && userPermissions.length > 0) {
            for (const up of userPermissions) {
                const user = userEntities.find(user => user.email === up.user_email);
                const permission = permissionEntities.find(permission => permission.key === up.permission_key);

                if (!user || !permission) continue;

                const userPermissionEntity: UserPermissionEntity = {
                    user_id: user.id!,
                    permission_id: permission.id!
                };

                await firstOrCreate(db.user_permissions, '[user_id+permission_id]', [user.id!, permission.id!], {...userPermissionEntity, created_at: nowIso(), updated_at: nowIso()}, { override: true });
            }
        }

        if (userMenus && userMenus.length > 0) {
            for (const um of userMenus) {
                const user = userEntities.find(user => user.email === um.user_email);
                const menu = menuEntities.find(menu => menu.path === um.menu_path);

                if (!user || !menu) continue;

                const userMenuEntity = {
                    user_id: user.id!,
                    menu_id: menu.id!
                };

                await firstOrCreate(db.user_menus, '[user_id+menu_id]', [user.id!, menu.id!], {...userMenuEntity, created_at: nowIso(), updated_at: nowIso()}, { override: true });
            }
        }
    });
}