import {createContext} from "react";
import type {IMessageContext} from "@app/contexts/layout/types.ts";

export const MessageContext = createContext<IMessageContext | null>(null);