import LayoutAuth from "@/layouts/LayoutAuth/Index.tsx";
import Fallback from "@/routes/FallbackRoutes.tsx";
import {Route} from "react-router-dom";
import LoginProvider from "@/pages/auth/login/LoginProvider.tsx";
import {RouteProtection} from "@app/guards/RouteProtection/RouteProtection.tsx";

export default function () {
    return (
        <Route path='/auth' element={
            <RouteProtection requireAuth={false}>
                <LayoutAuth />
            </RouteProtection>
        }>
            <Route index element={<Fallback route={'/'} replace={true} />} />
            <Route path='login' element={<LoginProvider />} />
            <Route path='register' element={<div>Página de Registro - Em Desenvolvimento</div>} />
            <Route path='forgot-password' element={<div>Esqueci a Senha - Em Desenvolvimento</div>} />
            <Route path='*' element={<Fallback /> }  />
        </Route>
    )
}