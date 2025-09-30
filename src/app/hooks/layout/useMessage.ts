import {useContext} from "react";
import {MessageContext} from "@app/contexts/layout/MessageContext.tsx";

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) throw new Error("useMessage must be used within useMessage");
    return context;
}