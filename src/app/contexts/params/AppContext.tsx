import {createContext} from "react";
import type {IAppContext} from "@app/contexts/params/types.ts";

export const AppContext = createContext<IAppContext | null>(null);