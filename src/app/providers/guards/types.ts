import type {ReactNode} from "react";
import type {TPermission} from "@/api/models/Permissions.interface.ts";

export interface IPermissionGuardProps {
    children: ReactNode;
    roles?: string[];
    permissions?: TPermission[];
    requireAll?: boolean;
    fallback?: ReactNode;
}