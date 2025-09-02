import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "@/api/services/AuthService.ts";
import LoginPage from "@/pages/auth/login/LoginPage.tsx";
import {useCallback, useEffect, useState} from "react";
import type {ILoginCredentials, ILoginResponse} from "@/api/models/Auth.interface.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";

export default function LoginProvider() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = useCallback(() => {
        const to = location?.state?.from ?? '/';
        navigate(to, { replace: true });
    }, [location?.state?.from, navigate]);

    useEffect(() => {
        let active = true;
        AuthService.me().then((response) => {
            if (!active) return;
            if (response.success) redirect();
        });
        return () => { active = false; }
    }, [redirect]);

    const handleSubmit = async (credentials: ILoginCredentials) => {
        setLoading(true);
        setError(null);

        try {
            const response = (await AuthService.login(credentials)) as IApiSuccess<ILoginResponse>;
            if (!response.success) return setError(response.message ?? 'Invalid Credentials');
            redirect();
        } catch {
            setError('Unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return <LoginPage onSubmit={handleSubmit} loading={loading} error={error} />;
}