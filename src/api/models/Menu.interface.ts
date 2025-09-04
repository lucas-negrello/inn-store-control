import type {TRoles} from "@/api/models/Roles.interface.ts";
import type {IBaseModel} from "@/api/interfaces/ApiResponse.interface.ts";
import type {TPermission} from "@/api/models/Permissions.interface.ts";

export interface IMenuItem extends IBaseModel{
    parent_id?: number | string;
    label: string;
    route: string;
    icon?: string;
    isActive: boolean;
    sort_order?: number;
    roles?: TRoles;
    permissions?: TPermission[];
    children?: IMenuItem[];
}