import {createContext} from "react";
import type {IEntityFormRoutingContext} from "@app/contexts/forms/types.ts";

export const EntityFormRoutingContext = createContext<IEntityFormRoutingContext | null>(null);