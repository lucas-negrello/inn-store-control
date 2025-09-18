import { AppContext } from "@/app/contexts/params/AppContext";
import type {IAppProps} from "@app/providers/params/types.ts";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import type {IUser} from "@/api/models/Users.interface.ts";
import type {IAppContext} from "@app/contexts/params/types.ts";
import {AuthService} from "@/api/services/AuthService.ts";
import {sessionStorageService} from "@/utils/storage/services/StorageService.ts";
import {UserAdapter} from "@/infrastructure/localDb/adapters/UserAdapter.ts";

export const AppProvider = ({ children }: IAppProps) => {
    const [userId, setUserId] = useState<string | number | undefined>(undefined);
    const [user, setUser] = useState<IUser | undefined>(undefined);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const location = useLocation();
    const navigate = useNavigate();

    const checkAuthentication = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await AuthService.me();
            if (response.success && response.data) {
                setUser(response.data);
                setUserId(response.data.id);
                setIsAuthenticated(true);
                return true;
            } else {
                setUser(undefined);
                setUserId(undefined);
                setIsAuthenticated(false);
                return false;
            }
        } catch (error) {
            setUser(undefined);
            setUserId(undefined);
            setIsAuthenticated(false);
            console.log('CheckAuthenticationError:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]);

    useEffect(() => {
        const savedUser = sessionStorageService.get<IUser>('user');
        if (isAuthenticated && user) {
            if (savedUser) return;
            return sessionStorageService.set('user', UserAdapter.toUserSafe(user));
        }
        return sessionStorageService.remove('user');
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (!isAuthenticated || isLoading) return;

        const pathSegments = location.pathname.split('/').filter(Boolean);

        if (pathSegments.length > 0 && !pathSegments[0].startsWith('auth')) {
            const potentialUserId = pathSegments[0];
            if (potentialUserId && String(user?.id) === String(potentialUserId)) {
                setUserId(user?.id);
            } else if (potentialUserId && !isNaN(Number(potentialUserId))) {
                navigate(`/${user?.id}`, { replace: true });
            }
        }
    }, [location.pathname, isAuthenticated, user, navigate, isLoading]);

    const handleSetUserId = (id?: string | number) => {
        setUserId(id);
    };

    const handleSetUser = (userData: IUser) => {
        setUser(userData);
        setUserId(userData.id);
        setIsAuthenticated(true);
    };

    const handleLogin = async (userData: IUser) => {
        setUser(userData);
        setUserId(userData.id);
        setIsAuthenticated(true);
        navigate(`/${userData?.id}`, { replace: true });
    }

    const handleLogout = async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error('LogoutError:', error);
        } finally {
            setUserId(undefined);
            setUser(undefined);
            setIsAuthenticated(false);
            navigate('/', { replace: true });
        }
    };

    const contextValue: IAppContext = useMemo(() => ({
        userId,
        isAuthenticated,
        user,
        isLoading,
        setUserId: handleSetUserId,
        setUser: handleSetUser,
        login: handleLogin,
        logout: handleLogout,
        checkAuth: checkAuthentication,
    }), [checkAuthentication, handleLogin, handleLogout, isAuthenticated, isLoading, user, userId]);

    // You can add more global state or functions here as needed

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};