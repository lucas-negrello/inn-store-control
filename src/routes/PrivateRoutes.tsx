import {Route, Outlet} from "react-router-dom";
import Fallback from "@/routes/FallbackRoutes.tsx";
import LayoutPrivate from "@/layouts/LayoutPrivate/Index.tsx";
import DashboardPage from "@/pages/private/dashboard/DashboardPage.tsx";
import StockPage from "@/pages/private/stock/StockPage.tsx";
import MaintenancePage from "@/pages/private/maintenance/MaintenancePage.tsx";
import MarketPage from "@/pages/private/market/MarketPage.tsx";
import ReportsPage from "@/pages/private/reports/ReportsPage.tsx";

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

function PrivateRoutesWrapper({ isAllowed, fallbackProps }: Props) {
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
            element={<PrivateRoutesWrapper isAllowed={isAllowed} /> }
        >
            <Route path='' element={<LayoutPrivate onLogoClickRoute={`/${userId}`} showMenuButton={true}/>}>
                <Route index element={<DashboardPage />} />
                <Route path="stock" element={<StockPage />} />
                <Route path="maintenance" element={<MaintenancePage />} />
                <Route path="market" element={<MarketPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="*" element={<Fallback route={`/${userId}`} replace={false} /> } />
            </Route>
        </Route>
    );
}