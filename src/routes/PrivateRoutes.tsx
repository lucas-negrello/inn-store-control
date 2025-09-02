import {Route, Outlet} from "react-router-dom";
import Fallback from "@/routes/FallbackRoutes.tsx";
import LayoutPrivate from "@/layouts/LayoutPrivate/Index.tsx";

type Props =  {
    isAllowed: boolean;
    userId?: string;
    fallbackProps?: FallbackProps;
}

type FallbackProps =  {
    route?: string;
    relative?: 'route' | 'path';
    replace?: boolean;
};

function PrivateRoutes({ isAllowed, fallbackProps }: Props) {
    return isAllowed ?
        <Outlet /> :
        <Fallback
            route={fallbackProps?.route}
            replace={fallbackProps?.replace}
            relative={fallbackProps?.relative}
        />;
}

export default function ({isAllowed, userId}: Props) {
    return (
        <Route
            path={`/${userId}`}
            element={<PrivateRoutes isAllowed={isAllowed} /> }
        >
            <Route path='' element={<LayoutPrivate showMenuButton={true}/>}>
                <Route index element={<h1>Dashboard</h1>} />
                <Route path="stock" element={<h1>Stock</h1>} />
                <Route path="maintenance" element={<h1>Maintenance</h1>} />
                <Route path="market" element={<h1>Market</h1>} />
                <Route path="*" element={<Fallback route={`/${userId}`} replace={false} /> } />
            </Route>
        </Route>
    );
}