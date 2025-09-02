import { AppContext } from "@/app/contexts/params/AppContext";
import type {IAppProps} from "@app/providers/params/types.ts";
import {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import type {IUser} from "@/api/models/Users.interface.ts";
import type {IAppContext} from "@app/contexts/params/types.ts";

export const AppProvider = ({ children }: IAppProps) => {
    const [userId, setUserId] = useState<string | number | undefined>(undefined);
    const [user, setUser] = useState<IUser | undefined>(undefined);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const params = useParams();
    const location = useLocation();

    useEffect(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean);

        if (pathSegments.length > 0) {
            const potentialUserId = pathSegments[0];

            if (potentialUserId && !isNaN(Number(potentialUserId))) {
                setUserId(Number(potentialUserId));
                setIsAuthenticated(true);
            } else if (potentialUserId && potentialUserId.length > 0) {
                setUserId(potentialUserId);
                setIsAuthenticated(true);
            }
        } else {
            setUserId(undefined);
            setIsAuthenticated(false);
        }
    }, [location.pathname]);

    const handleSetUserId = (id?: string | number) => {
        setUserId(id);
        setIsAuthenticated(!!id);
    };

    const handleSetUser = (user: IUser) => {
        setUser(user);
        setUserId(user.id);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setUserId(undefined);
        setUser(undefined);
        setIsAuthenticated(false);
    };

    const contextValue: IAppContext = {
        userId,
        isAuthenticated,
        user,
        setUserId: handleSetUserId,
        setUser: handleSetUser,
        logout: handleLogout,
    }

    // You can add more global state or functions here as needed

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};