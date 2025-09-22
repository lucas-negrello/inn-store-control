import {useAdminPage} from "@/pages/private/admin/AdminPageHook.tsx";
import {Box} from "@mui/material";
import {DataTable} from "@/shared/DataTable/AgGrid/DataTable.tsx";
import {type ColDef, type ValueGetterParams} from "ag-grid-community";
import type {IUser} from "@/api/models/Users.interface.ts";

export const UsersPage = () => {
    const { users } = useAdminPage();

    const colDefs: ColDef[] = [
        {
            headerName: 'ID',
            valueGetter: (params: ValueGetterParams<IUser>) => params.data?.id ?? 'N/A'
        },
        {
            headerName: 'Nome',
            valueGetter: (params: ValueGetterParams<IUser>) => params.data?.username ?? 'N/A'
        },
        {
            headerName: 'Email',
            valueGetter: (params: ValueGetterParams<IUser>) => params.data?.email ?? 'N/A'
        },
        {
            headerName: 'Cargo',
            valueGetter: (params: ValueGetterParams<IUser>) => params.data?.roles?.[0]?.name ?? 'N/A'
        },
        {
            headerName: 'Criado em',
            valueGetter: (params: ValueGetterParams<IUser>) => {
                const createdAt = params.data?.created_at;
                return createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A';
            }
        }
    ];

    console.log(users);

    return (
        <Box>
            <DataTable
                rowData={users}
                colDefs={colDefs}
            />
        </Box>
    );
}