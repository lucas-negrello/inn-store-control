import {CrudFacade} from "@/api/facades/base/CrudFacade.ts";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import type {TClient} from "@/api/interfaces/Client.interface.ts";
import {environment} from "@/environments/environment.ts";
import type {IHttpFacadeOptions} from "@/api/interfaces/HttpFacade.interface.ts";
import type {LocalClientStrategy} from "@/api/clients/base/LocalClientStrategy.ts";
import {Env} from "@/config/env.ts";

export class MenuFacade extends CrudFacade<IMenuItem> {
    
    constructor(
        url: string,
        clientType: TClient = Env.defaultStrategy,
        options?: IHttpFacadeOptions,
        localClientStrategy?: LocalClientStrategy<IMenuItem>
    ) {
        super(url, clientType, options, localClientStrategy);
    }
}