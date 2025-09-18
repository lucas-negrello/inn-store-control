import {CrudFacade} from "@/api/facades/base/CrudFacade.ts";
import type {TClient} from "@/api/interfaces/Client.interface.ts";
import {Env} from "@/config/env.ts";
import type {IHttpFacadeOptions} from "@/api/interfaces/HttpFacade.interface.ts";
import type {IRole} from "@/api/models/Roles.interface.ts";

export class RoleFacade extends CrudFacade<IRole> {
    constructor(
        url: string = 'roles',
        clientType: TClient = Env.defaultStrategy,
        options: IHttpFacadeOptions = {
            useStorage: false,
        },
    ) {
        super(url, clientType, options);
    }

    // TODO: Implement the role-specific methods here [attach/detach permissions, etc.]

}