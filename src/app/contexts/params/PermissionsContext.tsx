import {createContext} from "react";
import type {IPermissionContext} from "@app/contexts/params/types.ts";

export const PermissionsContext = createContext<IPermissionContext | null>(null);