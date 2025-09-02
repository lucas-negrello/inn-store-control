import {Route, Outlet} from "react-router-dom";
import Fallback from "@/routes/FallbackRoutes.tsx";
import LayoutPrivate from "@/layouts/LayoutPrivate/Index.tsx";
import DashboardPage from "@/pages/private/dashboard/DashboardPage.tsx";
import StockPage from "@/pages/private/stock/StockPage.tsx";
import MaintenancePage from "@/pages/private/maintenance/MaintenancePage.tsx";
import MarketPage from "@/pages/private/market/MarketPage.tsx";
import ReportsPage from "@/pages/private/reports/ReportsPage.tsx";
import {ProtectedRouteProvider} from "@app/providers/auth/ProtectedRouteProvider.tsx";


export default function () {
    return (
        <Route
            path="/:userId/*"
            element={
                <ProtectedRouteProvider requireAuth={true}>
                    <Outlet />
                </ProtectedRouteProvider> }
        >
            <Route path='' element={<LayoutPrivate onLogoClickRoute={`/`} showMenuButton={true}/>}>
                <Route index element={<DashboardPage />} />
                <Route path="stock" element={<StockPage />} />
                <Route path="maintenance" element={<MaintenancePage />} />
                <Route path="market" element={<MarketPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="*" element={<Fallback route={`/`} replace={false} /> } />
            </Route>
        </Route>
    );
}