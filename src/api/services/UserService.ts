import {UserFacade} from "@/api/facades/UserFacade.ts";
import type {IUser} from "@/api/models/Users.interface.ts";

const client = new UserFacade();

export const UserService = {
    getUsers: async () => await client.getAll(),
    getUserById: async (id: number | string) => await client.get(id),
    createUser: async (user: IUser) => await client.post(user),
    updateUser: async (id: number | string, user: Partial<IUser>) => await client.update(id, user),
    deleteUser: async (id: number | string) => await client.delete(id),
}