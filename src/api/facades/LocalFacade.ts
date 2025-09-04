import localClients from "@/api/strategies/LocalContext.ts";
import type {IUser} from "@/api/models/Users.interface.ts";
import type {BaseIdType} from "@/infrastructure/localDb/entities.ts";
import type {IRole} from "@/api/models/Roles.interface.ts";
import type {IPermission} from "@/api/models/Permissions.interface.ts";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";

export class LocalFacade {
    private _clients = localClients;

    /**
     *
     * User Functions for manipulating users local DB
     *
     * */

    createUser =
        (user: IUser, passwordHash?: string) =>
           this._clients.users.create(user, passwordHash);

    updateUser =
        (id: BaseIdType, patch: Partial<IUser>) =>
            this._clients.users.update(id, patch);

    deleteUser =
        (id: BaseIdType) =>
            this._clients.users.delete(id);

    getUser =
        (id: BaseIdType) =>
            this._clients.users.findById(id);

    getUserByEmail =
        (email: string) =>
            this._clients.users.findByEmail(email);

    listUsers =
        () =>
            this._clients.users.list();


    /**
     *
     * Role Functions for manipulating roles local DB
     *
     * */

    createRole =
        (role: IRole) =>
            this._clients.roles.create(role);

    updateRole =
        (id: BaseIdType, patch: Partial<IRole>) =>
            this._clients.roles.update(id, patch);

    deleteRole =
        (id: BaseIdType) =>
            this._clients.roles.delete(id);

    getRole =
        (id: BaseIdType) =>
            this._clients.roles.findById(id);

    getRoleBySlug =
        (slug: string) =>
            this._clients.roles.findBySlug(slug);

    listRoles =
        () =>
            this._clients.roles.list();

    /**
     *
     * Permission Functions for manipulating permissions local DB
     *
     * */

    createPermission =
        (permission: IPermission) =>
            this._clients.permissions.create(permission);

    upsertPermission =
        (permissions: IPermission[]) =>
            this._clients.permissions.upsertMany(permissions);

    updatePermission =
        (id: BaseIdType, patch: Partial<IPermission>) =>
            this._clients.permissions.update(id, patch);

    deletePermission =
        (id: BaseIdType) =>
            this._clients.permissions.delete(id);

    getPermission =
        (id: BaseIdType) =>
            this._clients.permissions.findById(id);

    getPermissionByKey =
        (key: string) =>
            this._clients.permissions.findByKey(key);

    listPermissions =
        () =>
            this._clients.permissions.list();

    /**
     *
     * Menu Functions for manipulating menus local DB
     *
     * */

    createMenuItem =
        (menuItem: IMenuItem) =>
            this._clients.menus.create(menuItem);

    updateMenuItem =
        (id: BaseIdType, patch: Partial<IMenuItem>) =>
            this._clients.menus.update(id, patch);

    deleteMenuItem =
        (id: BaseIdType) =>
            this._clients.menus.delete(id);

    getMenuItem =
        (id: BaseIdType) =>
            this._clients.menus.findById(id);

    listMenuItems =
        () =>
            this._clients.menus.list();

    listMenuItemsFlat =
        (withInactive: boolean = false) =>
            this._clients.menus.listFlat(withInactive);

    getMenuTree =
        (withInactive: boolean = false) =>
            this._clients.menus.getTree(withInactive);

    getMenuTreeByUser =
        (userId: BaseIdType, withInactive: boolean = false) =>
            this._clients.menus.getTreeForUser(userId, withInactive);

    /**
     *
     * User Relationships Functions for manipulating user relationships local DB
     *
     * */

    attachRolesToUser =
        (user_id: BaseIdType, role_ids: BaseIdType[]) =>
            this._clients.users.attachRoles(user_id, role_ids);

    detachRolesFromUser =
        (user_id: BaseIdType, role_ids: BaseIdType[]) =>
            this._clients.users.detachRoles(user_id, role_ids);

    getRolesOfUser =
        (user_id: BaseIdType) =>
            this._clients.users.getRoles(user_id);

    attachPermissionsToUser =
        (user_id: BaseIdType, permission_ids: BaseIdType[]) =>
            this._clients.users.attachPermissions(user_id, permission_ids);

    detachPermissionsFromUser =
        (user_id: BaseIdType, permission_ids: BaseIdType[]) =>
            this._clients.users.detachPermissions(user_id, permission_ids);

    getDirectPermissionsOfUser =
        (user_id: BaseIdType) =>
            this._clients.users.getDirectPermissions(user_id);

    getAllPermissionsOfUser =
        (user_id: BaseIdType) =>
            this._clients.users.getEffectivePermissions(user_id);

    attachMenusToUser =
        (user_id: BaseIdType, menu_ids: BaseIdType[]) =>
            this._clients.users.attachMenus(user_id, menu_ids);

    detachMenusFromUser =
        (user_id: BaseIdType, menu_ids: BaseIdType[]) =>
            this._clients.users.detachMenus(user_id, menu_ids);

    getMenusOfUser =
        (user_id: BaseIdType) =>
            this._clients.users.getMenus(user_id);

    /**
     *
     * Role Relationships Functions for manipulating role relationships local DB
     *
     * */

    attachPermissionsToRole =
        (role_id: BaseIdType, permission_ids: BaseIdType[]) =>
            this._clients.roles.attachPermissions(role_id, permission_ids);

    detachPermissionsFromRole =
        (role_id: BaseIdType, permission_ids: BaseIdType[]) =>
            this._clients.roles.detachPermissions(role_id, permission_ids);

    getPermissionsOfRole =
        (role_id: BaseIdType) =>
            this._clients.roles.getPermissions(role_id);
}