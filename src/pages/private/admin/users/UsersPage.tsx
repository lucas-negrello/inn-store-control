import {useAdminPage} from "@/pages/private/admin/AdminPageHook.tsx";
import {type ColDef, type ValueGetterParams} from "ag-grid-community";
import type {IUser} from "@/api/models/Users.interface.ts";
import {useMemo} from "react";
import {BaseDataTable, buildColumn, dateColumn, withRenderer} from "@/shared/DataTable/AgGrid";

export const UsersPage = () => {
    const { users, isLoading, errors } = useAdminPage();

    const colDefs = useMemo(() => [
        buildColumn<IUser>({ headerName: 'ID', valueGetter: (params: ValueGetterParams<IUser>) => params.data?.id ?? 'N/A' }),
        buildColumn<IUser>({ headerName: 'Nome', valueGetter: (params: ValueGetterParams<IUser>) => params.data?.username ?? 'N/A' }),
        withRenderer(buildColumn<IUser>({
            headerName: 'Email',
            valueGetter: (params: ValueGetterParams<IUser>) => params.data?.email
        }), 'emailLink'),
        withRenderer(buildColumn<IUser>({
            headerName: 'Status',
            valueGetter: (params: ValueGetterParams<IUser>) =>
                params.data?.isActive ? 'Ativo' : 'Inativo'
        }), 'statusBadge'),
        withRenderer(buildColumn<IUser>({
            headerName: 'Cargo',
            valueGetter: (params: ValueGetterParams<IUser>) =>
                params.data?.roles?.[0]?.name ?? 'N/A'
        }), 'statusBadge'),
        dateColumn<IUser>('created_at', 'Criado em'),
    ], []);

    console.log(users);

    return (
        <BaseDataTable
            height={400}
            colDefs={colDefs}
            rowData={users}
            loading={isLoading}
            error={errors}
            selectionMode="multiple"
            checkboxSelection
            persistKey="users-table-v1"
            pagination
            onRowClick={(row) => console.log('clicked', row)}
            onSelectionChange={(rows) => console.log('selected', rows)}
            autoSizeStrategy="fitVisible"
            dense
        />
    );
}