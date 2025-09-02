import type {ILoginCredentials} from "@/api/models/Auth.interface.ts";
import {AuthFacade} from "@/api/facades/AuthFacade.ts";
import {environment} from "@/environments/environment.ts";

const client = new AuthFacade(`auth`, environment.defaultStrategy, {
    useStorage: true,
    storageType: 'local',
});
export const AuthService = {
    login: (credentials: ILoginCredentials) => client.login(credentials),
    logout: () => client.logout(),
    me: () => client.me(),
}