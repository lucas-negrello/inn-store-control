import {useAdminPage} from "@/pages/private/admin/AdminPageHook.tsx";
import {type ColDef, type ValueGetterParams} from "ag-grid-community";
import type {IUser} from "@/api/models/Users.interface.ts";
import {useCallback, useEffect, useMemo} from "react";
import {
    BaseDataTable,
    buildColumn,
    dateColumn,
    defaultCrudActions, type RegisteredCellRendererParams,
    withRenderer
} from "@/shared/DataTable/AgGrid";
import {usePermissions} from "@app/hooks/params/usePermissions.ts";
import {EntityFormRoutingProvider} from "@app/providers/forms/EntityFormRoutingProvider.tsx";
import {useMessage} from "@app/hooks/layout/useMessage.ts";
import {Box, Button, Typography} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import {Outlet} from "react-router-dom";
import {useEntityFormRouting} from "@app/hooks/forms/useEntityFormRouting.ts";

export const UsersPage = () => {
    const { hasAnyPermission } = usePermissions();
    const { setOpen: displayToast, setMessage } = useMessage();
    const { users, isLoading, errors } = useAdminPage();
    const { openCreate, openView, openEdit, modalResult, clearModalResult } = useEntityFormRouting();

    const canCreate = hasAnyPermission(['create_users']);
    const canView = hasAnyPermission(['view_users']);
    const canEdit = hasAnyPermission(['update_users']);
    const canDelete = hasAnyPermission(['delete_users']);

    useEffect(() => {
        if ((modalResult as any)?.saved) {
            setMessage(`Usuário ${(modalResult as any).saved.username} salvo com sucesso!`);
            displayToast(true);
            clearModalResult();
        }
    }, [setMessage, displayToast, modalResult, clearModalResult]);

    const onCreate = () => {
        openCreate();
    }
    const onEdit = useCallback((data: IUser, params: RegisteredCellRendererParams<IUser>) => {
        console.log('Edit User', data, params)
        openEdit(data.id!);
    }, [openEdit]);
    const onView = useCallback((data: IUser, params: RegisteredCellRendererParams<IUser>) => {
        console.log('View User', data, params)
        openView(data.id!);
    }, [openView]);
    const onDelete = useCallback((data: IUser, params: RegisteredCellRendererParams<IUser>) => {
        console.log('Delete User', data, params)
    }, []);

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
    ], [ canEdit, canView, canDelete, onEdit, onView, onDelete ]);

    return (
        <EntityFormRoutingProvider basePath="admin/users">
            <Box
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}
            >
                <Button
                    loading={isLoading}
                    onClick={onCreate}
                    disabled={!canCreate}
                    variant="outlined"
                    sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
                >
                    <PersonAdd />
                    <Typography variant="button">
                        Criar Usuário
                    </Typography>
                </Button>
            </Box>
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

            <Outlet />
        </EntityFormRoutingProvider>
    );
}