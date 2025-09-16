import {useState} from "react";
import RegisterPage from "@/pages/auth/register/RegisterPage.tsx";

export default function RegisterProvider() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return <RegisterPage loading={loading} error={error}/>;
}