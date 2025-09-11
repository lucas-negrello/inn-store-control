import {Route, Outlet} from "react-router-dom";
import Fallback from "@/routes/FallbackRoutes.tsx";
import LayoutPrivate from "@/layouts/LayoutPrivate/Index.tsx";
import DashboardPage from "@/pages/private/dashboard/DashboardPage.tsx";
import StockPage from "@/pages/private/stock/StockPage.tsx";
import MaintenancePage from "@/pages/private/maintenance/MaintenancePage.tsx";
import MarketPage from "@/pages/private/market/MarketPage.tsx";
import ReportsPage from "@/pages/private/reports/ReportsPage.tsx";
import {ProtectedRouteProvider} from "@app/providers/auth/ProtectedRouteProvider.tsx";
import AccountPage from "@/pages/private/account/AccountPage.tsx";
import AdminPage from "@/pages/private/admin/AdminPage.tsx";


export default function () {
    return (
        <Route
            path="/:userId/*"
            element={
                <ProtectedRouteProvider requireAuth={true}>
                    <Outlet />
                </ProtectedRouteProvider> }
        >
            <Route path='' element={<LayoutPrivate showMenuButton={true}/>}>
                <Route index element={<DashboardPage />} />

                <Route path="account" element={<AccountPage />} />

                <Route path="stock" element={
                    <ProtectedRouteProvider roles={['admin', 'manager']}>
                        <StockPage />
                    </ProtectedRouteProvider>
                } />

                <Route path="maintenance" element={
                    <ProtectedRouteProvider roles={['admin', 'manager']}>
                        <MaintenancePage />
                    </ProtectedRouteProvider>
                } />

                <Route path="market" element={
                    <ProtectedRouteProvider roles={['admin', 'manager']}>
                        <MarketPage />
                    </ProtectedRouteProvider>
                } />

                <Route path="reports" element={
                    <ProtectedRouteProvider roles={['admin']}>
                        <ReportsPage />
                    </ProtectedRouteProvider>
                } />

                <Route path="admin" element={
                    <ProtectedRouteProvider roles={['admin']}>
                        <AdminPage />
                    </ProtectedRouteProvider>
                } />

                <Route path="*" element={<Fallback route={`/`} replace={false} /> } />
            </Route>
        </Route>
    );
}