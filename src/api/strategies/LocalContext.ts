import {MenusClientLocal, PermissionsClientLocal, RolesClientLocal, UsersClientLocal} from "@/api/clients/local";

export interface ILocalClient {
    users: UsersClientLocal,
    roles: RolesClientLocal,
    permissions: PermissionsClientLocal,
    menus: MenusClientLocal
}
class LocalContext {
    private static instance: LocalContext | null = null;

    private readonly _clients: ILocalClient;

    private constructor() {
        this._clients = {
            users: new UsersClientLocal(),
            roles: new RolesClientLocal(),
            permissions: new PermissionsClientLocal(),
            menus: new MenusClientLocal()
        };
    }

    static getInstance(): LocalContext {
        if (!LocalContext.instance) {
            LocalContext.instance = new LocalContext();
        }
        return LocalContext.instance;
    }

    get clients(): ILocalClient {
        return this._clients;
    }
}

const localClients = LocalContext.getInstance().clients;
export default localClients;