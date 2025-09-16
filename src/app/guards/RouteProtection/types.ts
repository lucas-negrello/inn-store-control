import type {ReactNode} from "react";

export interface IProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
    roles?: string[];
    permissions?: string[];
    requireAll?: boolean;
    fallbackRoute?: ReactNode;
}