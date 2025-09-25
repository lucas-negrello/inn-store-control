import type { ColDef, ColDefField, ValueFormatterParams } from 'ag-grid-community';
import {cellRenderRegistry} from "@/shared/DataTable/AgGrid/CellRendererRegistry.tsx";
import {capitalizeAll} from "@/utils/transforms/StringUtils.ts";
import {formatCurrency} from "@/utils/transforms/NumberUtils.ts";
import {DeleteForever, Edit, Visibility} from "@mui/icons-material";
import type {RegisteredCellRendererParams, TCellRendererMap} from "@/shared/DataTable/AgGrid/DataTableTypes.ts";
import type {
    ActionsColumnOptions, ColAction,
    ColActionsProvider
} from "@/shared/DataTable/AgGrid/cellRenderers/ActionsCell.tsx";

export type DefaultActionCrudProps<T> = {
    canView?: boolean,
    canEdit?: boolean,
    canDelete?: boolean,
    onView?: (data: T, params: RegisteredCellRendererParams<T>) => void,
    onEdit?: (data: T, params: RegisteredCellRendererParams<T>) => void,
    onDelete?: (data: T, params: RegisteredCellRendererParams<T>) => void,
};

export function buildColumn<T>(partial: ColDef<T>): ColDef<T> {
    return {
        sortable: true,
        filter: true,
        resizable: true,
        suppressMovable: false,
        ...partial,
    }
}

export function dateColumn<T>(field: ColDefField<T>, headerName?: string, opts?: Partial<ColDef<T>>): ColDef<T> {
    return buildColumn<T>({
        field,
        headerName: headerName ?? capitalizeAll(field),
        valueFormatter: (params: ValueFormatterParams<T, any>) => {
            if (!params.value) return '';
            const date = new Date(params.value);
            return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
        },
        ...opts
    });
}

export function currencyColumn<T>(field: ColDefField<T>, headerName?: string, opts?: Partial<ColDef<T>>): ColDef<T> {
    return buildColumn<T>({
        field,
        headerName: headerName ?? capitalizeAll(field),
        type: 'numericColumn',
        valueFormatter: (params: ValueFormatterParams<T, any>) => formatCurrency(params.value, ''),
        ...opts
    });
}

export function actionsColumn<T>(actionsProvider: ColActionsProvider<T>, opts: ActionsColumnOptions<T> = {}): ColDef<T> {
    const {
        headerName = '',
        width = 65,
        alwaysShowButton,
        autoDisableWhenEmpty,
        menuAriaLabel,
        ...rest
    } = opts;

    return withRenderer<T>(buildColumn<T>({
        headerName,
        field: '__actions__' as ColDefField<T>,
        width,
        maxWidth: width,
        resizable: false,
        sortable: false,
        filter: false,
        pinned: 'right',
        suppressMovable: true,
        suppressHeaderFilterButton: true,
        cellRenderer: 'actions',
        cellRendererParams: {
            actionsProvider,
            alwaysShowButton,
            autoDisableWhenEmpty,
            menuAriaLabel
        },
        ...rest
    }), 'actions');
}

export function defaultCrudActions<T>(props: DefaultActionCrudProps<T>): ColDef<T> {
    const { canView, canEdit, canDelete, onView, onEdit, onDelete } = props;

    const editAction: ColAction<T> = {
        title: 'Editar',
        icon: <Edit />,
        color: "info",
        disabled: !canEdit || !onEdit,
        onClick: (data, params) => onEdit?.(data, params)
    };

    const viewAction: ColAction<T> = {
        title: 'Ver',
        icon: <Visibility />,
        color: "default",
        disabled: !canView || !onView,
        onClick: (data, params) => onView?.(data, params)
    };

    const deleteAction: ColAction<T> = {
        title: 'Deletar',
        icon: <DeleteForever />,
        color: "error",
        disabled: !canDelete || !onDelete,
        onClick: (data, params) => onDelete?.(data, params)
    };

    const actions: ColAction<T>[] = [
        editAction,
        viewAction,
        deleteAction
    ];

    return actionsColumn<T>(actions);
}

export function withRenderer<T>(col: ColDef<T>, rendererName: TCellRendererMap): ColDef<T> {
    const reg = cellRenderRegistry.get(rendererName);
    if (!reg) {
        console.warn(`Renderer ${rendererName} not found in registry.`);
        return col;
    }
    return {
        ...col,
        cellRenderer: (params: any) => reg.renderer(params),
    };
}