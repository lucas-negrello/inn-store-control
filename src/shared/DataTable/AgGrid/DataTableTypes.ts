import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import type { ReactNode } from 'react';

export type RowId = string | number;

export interface BaseRow {
    id?: RowId;
    [key: string]: any;
}

export interface DataTableProps<T extends BaseRow = any> {
    rowData?: T[];
    colDefs: ColDef<T>[];
    loading?: boolean;
    error?: string | null;
    height?: string | number;
    minHeight?: string | number;
    autoSizeStrategy?: TAutoSizeStrategy;
    suppressAutoSizeOnInit?: boolean;
    onRowClick?: (row?: T) => void;
    onSelectionChange?: (selected: T[]) => void;
    selectionMode?: TSelectionMode;
    checkboxSelection?: boolean;
    rowIdGetter?: (row: T) => RowId;
    pagination?: boolean;
    paginationPerPage?: number[];
    paginationPageSize?: number;
    serverSide?: boolean;
    serverSource?: DataSource<T>;
    persistKey?: string;
    toolbar?: ReactNode;
    footer?: ReactNode;
    enableColumnResize?: boolean;
    enableColumnHide?: boolean;
    enableColumnReorder?: boolean;
    dense?: boolean;
    rowClassRules?: Record<string, (params: any) => boolean>;
    className?: string;
    localeText?: Record<string, string>;
    theme?: 'light' | 'dark' | string;
    getRowStyle?: (params: any) => any;
    getContextMenuItems?: (params: any) => any[];
    quickFilterText?: string;
}

export type TSelectionMode = keyof typeof CSelectionMode;
export const CSelectionMode = {
    none: 'none',
    single: 'single',
    multiple: 'multiple',
} as const;


export type TAutoSizeStrategy = keyof typeof CAutoSizeStrategy;
export const CAutoSizeStrategy = {
    fitAll: 'fitAll',
    fitVisible: 'fitVisible',
    none: 'none',
} as const;

export interface UseDataTableHook<T> {
    page: number;
    setPage: (page: number) => void;
    total: number;
    totalPages: number;
    pageSize: number;
    rows: T[];
    setRows: (rows: T[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    onSortChanged: (sortModel: any[]) => void;
    onFilterChanged: (filterModel: any) => void;
    refetch: () => Promise<void>;
}

export interface DataSourceParams {
    page: number;
    pageSize: number;
    sortModel: any[];
    filterModel: any;
}

export interface DataSourceResult<T> {
    rows: T[];
    total: number;
}

export type DataSource<T> = (params: DataSourceParams) => Promise<DataSourceResult<T>>;

export interface RegisteredCellRendererParams<T = any> extends ICellRendererParams<T, any> {
    valueFormatted: string;
    rowData: T;
}

export type RegisteredCellRenderer<T = any> = (props: RegisteredCellRendererParams<T>) => ReactNode;

export interface CellRendererRegistration<T = any> {
    name: TCellRendererMap;
    renderer: RegisteredCellRenderer<T>;
    priority?: number;
}

export type TCellRendererMap = keyof typeof CCellRendererMap;

export const CCellRendererMap = {
    emailLink: 'emailLink',
    statusBadge: 'statusBadge',
} as const;
