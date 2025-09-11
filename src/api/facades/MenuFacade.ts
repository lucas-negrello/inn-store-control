import {CrudFacade} from "@/api/facades/base/CrudFacade.ts";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import type {TClient} from "@/api/interfaces/Client.interface.ts";
import type {IHttpFacadeOptions} from "@/api/interfaces/HttpFacade.interface.ts";
import {Env} from "@/config/env.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import {MenusService as LocalMenusService} from "@/infrastructure/localDb/services/Resources/MenusService.ts";
import {ResponseAdapter} from "@/infrastructure/localDb/adapters/ResponseAdapter.ts";

export class MenuFacade extends CrudFacade<IMenuItem> {
    
    constructor(
        url: string,
        clientType: TClient = Env.defaultStrategy,
        options?: IHttpFacadeOptions,
    ) {
        super(url, clientType, options);
    }

    public getFlatMenu = async (withInactive = false): Promise<IApiSuccess<IMenuItem[]>> => {
        switch (this._clientType) {
            case "local":
                return LocalMenusService.listFlat(withInactive).then(menus => ResponseAdapter.toResponse(menus));
            case "axios":
                throw new Error('Not implemented');
            case "fetch":
                throw new Error('Not implemented');
            default:
                return ResponseAdapter.toResponse([], 500, 'Client type not supported');
        }
    }

    public getMenuTree = async (withInactive = false): Promise<IApiSuccess<IMenuItem[]>> => {
        switch (this._clientType) {
            case "local":
                return LocalMenusService.getTree(withInactive).then(menus => ResponseAdapter.toResponse(menus));
            case "axios":
                throw new Error('Not implemented');
            case "fetch":
                throw new Error('Not implemented');
            default:
                return ResponseAdapter.toResponse([], 500, 'Client type not supported');
        }
    }

    public getMenuTreeByUser = async (userId: number | string, withInactive = false): Promise<IApiSuccess<IMenuItem[]>> => {
        switch (this._clientType) {
            case "local":
                return LocalMenusService.getTreeForUser(userId, withInactive).then(menus => ResponseAdapter.toResponse(menus));
            case "axios":
                throw new Error('Not implemented');
            case "fetch":
                throw new Error('Not implemented');
            default:
                return ResponseAdapter.toResponse([], 500, 'Client type not supported');
        }
    }
}