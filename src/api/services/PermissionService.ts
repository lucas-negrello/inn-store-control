import {PermissionFacade} from "@/api/facades/PermissionFacade.ts";
import type {IPermission} from "@/api/models/Permissions.interface.ts";


const client = new PermissionFacade();

export const PermissionService = {
    getPermissions: async () => await client.getAll(),
    getPermissionById: async (id: number | string) => await client.get(id),
    createPermission: async (permission: IPermission) => await client.post(permission),
    updatePermission: async (id: number | string, permission: Partial<IPermission>) => await client.update(id, permission),
    deletePermission: async (id: number | string) => await client.delete(id),
}