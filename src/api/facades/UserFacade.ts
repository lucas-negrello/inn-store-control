import {CrudFacade} from "@/api/facades/base/CrudFacade.ts";
import type {IUser} from "@/api/models/Users.interface.ts";
import type {TClient} from "@/api/interfaces/Client.interface.ts";
import {Env} from "@/config/env.ts";
import type {IHttpFacadeOptions} from "@/api/interfaces/HttpFacade.interface.ts";

export class UserFacade extends CrudFacade<IUser> {
    constructor(
        url: string = 'users',
        clientType: TClient = Env.defaultStrategy,
        options: IHttpFacadeOptions = {
            useStorage: false,
        },
    ) {
        super(url, clientType, options);
    }

    // TODO: Implement the user-specific methods here [attach/detach roles, permissions, etc.]

}