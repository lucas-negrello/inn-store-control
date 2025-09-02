import LayoutAuth from "@/layouts/LayoutAuth/Index.tsx";
import Fallback from "@/routes/FallbackRoutes.tsx";
import {Route} from "react-router-dom";
import LoginProvider from "@/pages/auth/login/LoginProvider.tsx";
import {ProtectedRouteProvider} from "@app/providers/auth/ProtectedRouteProvider.tsx";

export default function () {
    return (
        <Route path='/auth' element={
            <ProtectedRouteProvider requireAuth={false}>
                <LayoutAuth />
            </ProtectedRouteProvider>
        }>
            <Route index element={<Fallback route={'/auth/login'} />} />
            <Route path='login' element={<LoginProvider />} />
            <Route path='register' element={<h1>Register</h1>} />
            <Route path='forgot-password' element={<h1>Forgot Password</h1>} />
            <Route path='*' element={<Fallback /> }  />
        </Route>
    )
}