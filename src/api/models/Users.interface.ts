import type {ISoftDeleteModel} from "@/api/interfaces/ApiResponse.interface.ts";
import type {IRole} from "@/api/models/Roles.interface.ts";
import type {IPermission} from "@/api/models/Permissions.interface.ts";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";

export interface IUser extends ISoftDeleteModel {
    username: string;
    email: string;
    password?: string;
    isActive: boolean;
    meta?: Partial<IUserMeta>;
    roles?: IRole[];
    permissions?: IPermission[];
    menus?: IMenuItem[];
}

// TODO: Extend user metadata as needed
export interface IUserMeta {
    // Add any additional metadata fields here
}