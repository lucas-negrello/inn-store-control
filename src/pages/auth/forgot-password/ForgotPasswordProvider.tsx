import {useState} from "react";
import ForgotPasswordPage from "@/pages/auth/forgot-password/ForgotPasswordPage.tsx";

export default function ForgotPasswordProvider() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return <ForgotPasswordPage loading={loading} error={error}/>;
}