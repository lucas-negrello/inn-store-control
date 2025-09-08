import {CrudFacade} from "@/api/facades/base/CrudFacade.ts";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import type {TClient} from "@/api/interfaces/Client.interface.ts";
import type {IHttpFacadeOptions} from "@/api/interfaces/HttpFacade.interface.ts";
import {Env} from "@/config/env.ts";

export class MenuFacade extends CrudFacade<IMenuItem> {
    
    constructor(
        url: string,
        clientType: TClient = Env.defaultStrategy,
        options?: IHttpFacadeOptions,
    ) {
        super(url, clientType, options);
    }
}