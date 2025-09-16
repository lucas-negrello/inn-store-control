import LayoutAuth from "@/layouts/LayoutAuth/Index.tsx";
import Fallback from "@/routes/FallbackRoutes.tsx";
import {Route} from "react-router-dom";
import LoginProvider from "@/pages/auth/login/LoginProvider.tsx";
import {RouteProtection} from "@app/guards/RouteProtection/RouteProtection.tsx";
import RegisterProvider from "@/pages/auth/register/RegisterProvider.tsx";
import ForgotPasswordProvider from "@/pages/auth/forgot-password/ForgotPasswordProvider.tsx";

export default function () {
    return (
        <Route path='/auth' element={
            <RouteProtection requireAuth={false}>
                <LayoutAuth />
            </RouteProtection>
        }>
            <Route index element={<Fallback route={'/'} replace={true} />} />
            <Route path='login' element={<LoginProvider />} />
            <Route path='register' element={<RegisterProvider />} />
            <Route path='forgot-password' element={<ForgotPasswordProvider />} />
            <Route path='*' element={<Fallback /> }  />
        </Route>
    )
}