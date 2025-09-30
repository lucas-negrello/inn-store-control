import type {RouteObject} from "react-router-dom";
import {UsersPage} from "@/pages/private/admin/users/UsersPage.tsx";
import UsersFormRouteModal from "@/pages/private/admin/users/form/UsersFormRouteModal.tsx";
import UserShowPage from "@/pages/private/admin/users/UserShowPage.tsx";

export const userRoutes: RouteObject = {
    path: 'users',
    element: <UsersPage />,
    children: [
        { path: 'create', element: <UsersFormRouteModal /> },
        { path: ':id/edit', element: <UsersFormRouteModal /> },
        { path: ':id', element: <UserShowPage /> }
    ]
}