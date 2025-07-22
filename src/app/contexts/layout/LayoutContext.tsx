import {createContext} from "react";
import type {ILayoutContext} from "@app/contexts/layout/types.ts";

export const LayoutContext = createContext<ILayoutContext | null>(null);