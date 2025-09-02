import type {IBaseModel} from "@/api/interfaces/ApiResponse.interface.ts";
import type {IRole} from "@/api/models/Roles.interface.ts";
import type {TPermission} from "@/api/models/Permissions.interface.ts";

export interface IUser extends IBaseModel {
    username: string;
    email: string;
    password: string;
    roles: IRole[];
    permissions: TPermission[];
    isActive: boolean;
    meta: Partial<IUserMeta>;
}

// TODO: Extend user metadata as needed
export interface IUserMeta {
    // Add any additional metadata fields here
    [key: string]: unknown;
}