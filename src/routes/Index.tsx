import {BrowserRouter, Route, Routes} from "react-router-dom";
import AuthRoutes from "@/routes/AuthRoutes.tsx";
import PublicRoutes from "@/routes/PublicRoutes.tsx";
import PrivateRoutes from "@/routes/PrivateRoutes.tsx";
import {AppProvider} from "@app/providers/params/AppProvider.tsx";
import FallbackRoutes from "@/routes/FallbackRoutes.tsx";

export default function () {
    // Todo: Make a authentication service to get allow/don´t allow and userId for routes
    return (
        <BrowserRouter>
            <AppProvider>
                <Routes>
                    {AuthRoutes()}
                    {PublicRoutes()}
                    {PrivateRoutes()}
                    <Route path="*" element={<FallbackRoutes route="/auth/login" />} />
                </Routes>
            </AppProvider>
        </BrowserRouter>
    );
}