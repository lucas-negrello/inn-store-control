import {useContext} from "react";
import {AccountPageContext} from "@/pages/private/account/AccountPageContext.tsx";

export const useAccountPage = () => {
    const context = useContext(AccountPageContext);
    if (!context) throw new Error('useAccountPage must be used within a AccountPageProvider');
    return context;
}