import type {ILoginCredentials} from "@/api/models/Auth.interface.ts";
import {AuthFacade} from "@/api/facades/AuthFacade.ts";
import {Env} from "@/config/env.ts";

const client = new AuthFacade(`auth`, Env.defaultStrategy, {
    useStorage: true,
    storageType: 'local',
});
export const AuthService = {
    login: (credentials: ILoginCredentials) => client.login(credentials),
    logout: () => client.logout(),
    me: () => client.me(),
}