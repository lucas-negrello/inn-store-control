import type {IPermission} from "@/api/models/Permissions.interface.ts";
import type {IBaseModel} from "@/api/interfaces/ApiResponse.interface.ts";

export interface IRole extends IBaseModel {
    name: string;
    slug: string;
    description?: string;
    permissions?: IPermission[];
}