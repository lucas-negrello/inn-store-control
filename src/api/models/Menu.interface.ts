import type {TRoles} from "@/api/models/Roles.interface.ts";
import type {IBaseModel} from "@/api/interfaces/ApiResponse.interface.ts";

export interface IMenuItem extends IBaseModel{
    label: string;
    route: string;
    icon?: string;
    isActive: boolean;
    roles: TRoles;
}