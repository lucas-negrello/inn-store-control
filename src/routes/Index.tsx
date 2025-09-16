import {BrowserRouter, Route, Routes} from "react-router-dom";
import AuthRoutes from "@/routes/auth/AuthRoutes.tsx";
import PublicRoutes from "@/routes/public/PublicRoutes.tsx";
import PrivateRoutes from "@/routes/private/PrivateRoutes.tsx";
import FallbackRoutes from "@/routes/FallbackRoutes.tsx";
import GlobalProviders from "@/routes/GlobalProviders.tsx";

export default function () {
    return (
        <BrowserRouter>
            <GlobalProviders>
                <Routes>
                    {AuthRoutes()}
                    {PublicRoutes()}
                    {PrivateRoutes()}
                    <Route path="*" element={<FallbackRoutes route="/auth/login" />} />
                </Routes>
            </GlobalProviders>
        </BrowserRouter>
    );
}