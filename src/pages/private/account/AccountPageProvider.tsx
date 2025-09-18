import {type ReactNode, useState} from "react";
import {useApp} from "@app/hooks/params/useApp.ts";
import {AccountPageContext, type IAccountPageContext} from "@/pages/private/account/AccountPageContext.tsx";

type IAccountPageProviderProps = {
    children: ReactNode;
}
export const AccountPageProvider = ({children}: IAccountPageProviderProps) => {
    const { user, isLoading } = useApp();

    const [loading, setLoading] = useState<boolean>(isLoading);

    const contextValue: IAccountPageContext = {
        user,
        isLoading: loading,
        setIsLoading: setLoading,
    }

    return (
        <AccountPageContext.Provider value={contextValue}>
            {children}
        </AccountPageContext.Provider>
    )

}