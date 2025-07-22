import LayoutAuth from "@/layouts/LayoutAuth/Index.tsx";
import Fallback from "@/routes/FallbackRoutes.tsx";
import {Route} from "react-router-dom";

export default function () {
    return (
        <Route path='/auth' element={<LayoutAuth />}>
            <Route index element={<Fallback route={'/auth/login'} />} />
            <Route path='login' element={<h1>Login</h1>} />
            <Route path='register' element={<h1>Register</h1>} />
            <Route path='forgot-password' element={<h1>Forgot Password</h1>} />
            <Route path='*' element={<Fallback /> }  />
        </Route>
    )
}