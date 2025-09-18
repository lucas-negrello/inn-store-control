import {CrudFacade} from "@/api/facades/base/CrudFacade.ts";
import type {TClient} from "@/api/interfaces/Client.interface.ts";
import {Env} from "@/config/env.ts";
import type {IHttpFacadeOptions} from "@/api/interfaces/HttpFacade.interface.ts";
import type {IPermission} from "@/api/models/Permissions.interface.ts";

export class PermissionFacade extends CrudFacade<IPermission> {
    constructor(
        url: string = 'permission',
        clientType: TClient = Env.defaultStrategy,
        options: IHttpFacadeOptions = {
            useStorage: false,
        },
    ) {
        super(url, clientType, options);
    }

    // TODO: Implement the permission-specific methods here

}