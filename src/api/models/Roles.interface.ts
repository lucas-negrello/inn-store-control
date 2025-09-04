import type {TPermission} from "@/api/models/Permissions.interface.ts";
import type {IBaseModel} from "@/api/interfaces/ApiResponse.interface.ts";

export type TRoles = IRole[];

export interface IRole extends IBaseModel {
    name: string;
    slug: string;
    description?: string;
    permissions?: TPermission[];
}