import {Route, Outlet} from "react-router-dom";
import Fallback from "@/routes/FallbackRoutes.tsx";
import type {IPrivateRouteProps} from "@/routes/types.ts";
import LayoutGeral from "@/layouts/LayoutGeral/Index.tsx";

function PrivateRoutes({ isAllowed, fallbackProps }: IPrivateRouteProps) {
    return isAllowed ?
        <Outlet /> :
        <Fallback
            route={fallbackProps?.route}
            replace={fallbackProps?.replace}
            relative={fallbackProps?.relative}
        />;
}

export default function ({isAllowed, userId}: IPrivateRouteProps) {
    return (
        <Route
            path={`/${userId}`}
            element={<PrivateRoutes isAllowed={isAllowed} /> }
        >
            <Route path='' element={<LayoutGeral />}>
                <Route index element={<h1>Dashboard</h1>} />
                <Route path="stock" element={<h1>Stock</h1>} />
                <Route path="maintenance" element={<h1>Maintenance</h1>} />
                <Route path="market" element={<h1>Market</h1>} />
                <Route path="*" element={<Fallback route={`/${userId}`} replace={false} /> } />
            </Route>
        </Route>
    );
}