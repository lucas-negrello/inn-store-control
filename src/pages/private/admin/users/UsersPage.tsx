import {useAdminPage} from "@/pages/private/admin/AdminPageHook.tsx";
import {type ColDef, type ValueGetterParams} from "ag-grid-community";
import type {IUser} from "@/api/models/Users.interface.ts";
import {useMemo} from "react";
import {
    actionsColumn,
    BaseDataTable,
    buildColumn,
    dateColumn,
    defaultCrudActions, type RegisteredCellRendererParams,
    withRenderer
} from "@/shared/DataTable/AgGrid";
import type {ColAction} from "@/shared/DataTable/AgGrid/cellRenderers/ActionsCell.tsx";
import {DeleteForever, Edit, Visibility} from "@mui/icons-material";
import {usePermissions} from "@app/hooks/params/usePermissions.ts";

export const UsersPage = () => {
    const { users, isLoading, errors } = useAdminPage();
    const { hasAnyPermission } = usePermissions();

    const canCreate = hasAnyPermission(['create_users']);
    const canView = hasAnyPermission(['view_users']);
    const canEdit = hasAnyPermission(['update_users']);
    const canDelete = hasAnyPermission(['delete_users']);

    const onEdit = (data: IUser, params: RegisteredCellRendererParams<IUser>) => {
        console.log('Edit User', data, params)
    };
    const onView = (data: IUser, params: RegisteredCellRendererParams<IUser>) => {
        console.log('View User', data, params)
    };
    const onDelete = (data: IUser, params: RegisteredCellRendererParams<IUser>) => {
        console.log('Delete User', data, params)
    };

    const colDefs = useMemo((): ColDef<IUser>[] => [
        buildColumn<IUser>({
            headerName: 'ID',
            valueGetter: (params: ValueGetterParams<IUser>) => params.data?.id ?? 'N/A',
            width: 75,
        }),
        buildColumn<IUser>({
            headerName: 'Nome',
            valueGetter: (params: ValueGetterParams<IUser>) => params.data?.username ?? 'N/A',
            minWidth: 170,
        }),
        withRenderer(buildColumn<IUser>({
            headerName: 'Email',
            valueGetter: (params: ValueGetterParams<IUser>) => params.data?.email,
            minWidth: 170,
        }), 'emailLink'),
        withRenderer(buildColumn<IUser>({
            headerName: 'Status',
            valueGetter: (params: ValueGetterParams<IUser>) =>
                params.data?.isActive ? 'Ativo' : 'Inativo',
            minWidth: 120,
            initialWidth: 120,
        }), 'statusBadge'),
        withRenderer(buildColumn<IUser>({
            headerName: 'Cargo',
            valueGetter: (params: ValueGetterParams<IUser>) =>
                params.data?.roles?.[0]?.name ?? 'N/A',
            minWidth: 170,
            initialWidth: 170,
        }), 'statusBadge'),
        dateColumn<IUser>('created_at', 'Criado em'),
        defaultCrudActions({
            canEdit,
            canView,
            canDelete,
            onEdit,
            onView,
            onDelete,
        }),
    ], [ canEdit, canView, canDelete ]);

    return (
        <BaseDataTable
            height={400}
            colDefs={colDefs}
            rowData={users}
            loading={isLoading}
            error={errors}
            pagination
            autoSizeStrategy="fitAll"
            dense
        />
    );
}