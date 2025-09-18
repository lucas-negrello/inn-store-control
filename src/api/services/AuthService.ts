import type {ILoginCredentials} from "@/api/models/Auth.interface.ts";
import {AuthFacade} from "@/api/facades/AuthFacade.ts";

const client = new AuthFacade();
export const AuthService = {
    login: async (credentials: ILoginCredentials) => await client.login(credentials),
    logout: async () => await client.logout(),
    me: async () => await client.me(),
}