import {RoleFacade} from "@/api/facades/RoleFacade.ts";
import type {IRole} from "@/api/models/Roles.interface.ts";

const client = new RoleFacade();

export const RoleService = {
    getRoles: async () => await client.getAll(),
    getRoleById: async (id: number | string) => await client.get(id),
    createRole: async (role: IRole) => await client.post(role),
    updateRole: async (id: number | string, role: Partial<IRole>) => await client.update(id, role),
    deleteRole: async (id: number | string) => await client.delete(id),
}