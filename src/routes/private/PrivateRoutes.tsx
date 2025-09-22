import {Route, Outlet} from "react-router-dom";
import Fallback from "@/routes/FallbackRoutes.tsx";
import LayoutPrivate from "@/layouts/LayoutPrivate/Index.tsx";
import DashboardPage from "@/pages/private/dashboard/DashboardPage.tsx";
import StockPage from "@/pages/private/stock/StockPage.tsx";
import MaintenancePage from "@/pages/private/maintenance/MaintenancePage.tsx";
import MarketPage from "@/pages/private/market/MarketPage.tsx";
import ReportsPage from "@/pages/private/reports/ReportsPage.tsx";
import {RouteProtection} from "@app/guards/RouteProtection/RouteProtection.tsx";
import AccountPage from "@/pages/private/account/AccountPage.tsx";
import AdminPage from "@/pages/private/admin/AdminPage.tsx";
import {AccountPageProvider} from "@/pages/private/account/AccountPageProvider.tsx";
import {AdminPageProvider} from "@/pages/private/admin/AdminPageProvider.tsx";
import {RolesPage} from "@/pages/private/admin/roles/RolesPage.tsx";
import {PermissionsPage} from "@/pages/private/admin/permissions/PermissionsPage.tsx";
import {UsersPage} from "@/pages/private/admin/users/UsersPage.tsx";


export default function () {
    return (
        <Route
            path="/:userId/*"
            element={
                <RouteProtection requireAuth={true}>
                    <Outlet />
                </RouteProtection> }
        >
            <Route path='' element={<LayoutPrivate showMenuButton={true}/>}>
                <Route index element={<DashboardPage />} />

                <Route path="account" element={
                    <AccountPageProvider>
                        <AccountPage />
                    </AccountPageProvider>
                } />

                <Route path="stock" element={
                    <RouteProtection roles={['admin', 'manager']}>
                        <StockPage />
                    </RouteProtection>
                } />

                <Route path="maintenance" element={
                    <RouteProtection roles={['admin', 'manager']}>
                        <MaintenancePage />
                    </RouteProtection>
                } />

                <Route path="market" element={
                    <RouteProtection roles={['admin', 'manager']}>
                        <MarketPage />
                    </RouteProtection>
                } />

                <Route path="reports" element={
                    <RouteProtection roles={['admin']}>
                        <ReportsPage />
                    </RouteProtection>
                } />

                <Route path="admin/*" element={
                    <RouteProtection roles={['admin']}>
                        <AdminPageProvider>
                            <AdminPage />
                            <Outlet />
                        </AdminPageProvider>
                    </RouteProtection>
                }>
                    <Route path="roles" element={<RolesPage />} />
                    <Route path="permissions" element={<PermissionsPage />} />
                    <Route path="users" element={<UsersPage />} />
                </Route>

                <Route path="*" element={<Fallback route={`/`} replace={false} /> } />
            </Route>
        </Route>
    );
}