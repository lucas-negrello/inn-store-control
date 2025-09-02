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
            <Route index element={<Fallback route={'/'} replace={true} />} />
            <Route path='login' element={<LoginProvider />} />
            <Route path='register' element={<div>Página de Registro - Em Desenvolvimento</div>} />
            <Route path='forgot-password' element={<div>Esqueci a Senha - Em Desenvolvimento</div>} />
            <Route path='*' element={<Fallback /> }  />
        </Route>
    )
}