import type { ColDef, ColDefField, ValueFormatterParams } from 'ag-grid-community';
import {cellRenderRegistry} from "@/shared/DataTable/AgGrid/CellRendererRegistry.tsx";
import {capitalizeAll} from "@/utils/transforms/StringUtils.ts";
import {formatCurrency} from "@/utils/transforms/NumberUtils.ts";
import type {TCellRendererMap} from "@/shared/DataTable/AgGrid/DataTableTypes.ts";

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