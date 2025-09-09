import {
    AuthService,
    MenusService,
    PermissionsService,
    RolesService,
    UsersService
} from "@/infrastructure/localDb/services";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";

interface ServiceRegistry {
    users: UsersService;
    roles: RolesService;
    permissions: PermissionsService;
    menus: MenusService;
    auth: AuthService;
}

export class LocalConfig<T = any> {
    private readonly _registry: ServiceRegistry;
    constructor() {
        this._registry = {
            users: new UsersService(),
            roles: new RolesService(),
            permissions: new PermissionsService(),
            menus: new MenusService(),
            auth: new AuthService(),
        }
    }

    public fail<R>(message: string, code = 400): Promise<IApiSuccess<R>> {
        return new Promise((resolve) => {
          resolve({
              success: false,
              data: null as R,
              message,
              code
          });
        })
    }

    public resolveResource = (url: string): string => {
        return url
            .replace(/^\//, '')
            .split('?')[0]
            .split('/')[0]
            .trim()
            .toLowerCase();
    }

    public getService = (resource: string): any => {
        return (this._registry as Record<string, any>)[resource];
    }
}