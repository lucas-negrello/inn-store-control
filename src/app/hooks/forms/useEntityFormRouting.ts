import {useContext} from "react";
import {EntityFormRoutingContext} from "@app/contexts/forms/EntityFormRoutingContext.tsx";

export const useEntityFormRouting = () => {
    const context = useContext(EntityFormRoutingContext);
    if (!context) throw new Error('useEntityFormRouting must be used within a EntityFormRoutingProvider');
    return context;
}