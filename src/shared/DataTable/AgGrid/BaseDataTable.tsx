import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
import type {
    ColDef,
    GridApi,
    GridReadyEvent,
    GridOptions,
    SelectionChangedEvent,
    RowClickedEvent
} from 'ag-grid-community';
import {Box, useTheme} from '@mui/material';
import type {DataTableProps, BaseRow} from './DataTableTypes';
import {DataTableLoading} from './states/DataTableLoading';
import {DataTableEmpty} from './states/DataTableEmpty';
import {DataTableError} from './states/DataTableError';
import {cellRenderRegistry} from "@/shared/DataTable/AgGrid/CellRendererRegistry.tsx";
import {StatusBadgeCell} from "@/shared/DataTable/AgGrid/cellRenderers/StatusBadgeCell.tsx";
import {EmailLinkCell} from "@/shared/DataTable/AgGrid/cellRenderers/EmailLinkCell.tsx";

ModuleRegistry.registerModules([AllCommunityModule]);

cellRenderRegistry.register(StatusBadgeCell);
cellRenderRegistry.register(EmailLinkCell);

interface InternalState<T> {
    api: GridApi<T> | null;
}

const STORAGE_VERSION = 1;
function buildPersistKey(key: string) {
    return `dt_state_v${STORAGE_VERSION}_${key}`;
}


export function BaseDataTable<T extends BaseRow = any>(props: DataTableProps<T>) {
    const {
        colDefs,
        rowData,
        loading,
        error,
        height = '100%',
        minHeight = 240,
        autoSizeStrategy = 'fitVisible',
        suppressAutoSizeOnInit = false,
        onRowClick,
        onSelectionChange,
        selectionMode = 'none',
        checkboxSelection = false,
        rowIdGetter,
        pagination = false,
        paginationPerPage = [10, 25, 50, 100],
        paginationPageSize: pageSize = 25,
        serverSide = false,
        serverSource,
        persistKey,
        toolbar,
        footer,
        enableColumnHide = true,
        enableColumnResize = true,
        enableColumnReorder = true,
        dense = false,
        rowClassRules,
        className,
        localeText,
        theme: forcedTheme,
        getRowStyle,
        getContextMenuItems,
        quickFilterText
    } = props;

    const theme = useTheme();
    const internalRef = useRef<InternalState<T>>({api: null});
    const gridRef = useRef<AgGridReact<T>>(null);

    const mergedColDefs: ColDef<T>[] = useMemo(() => {
        if (!checkboxSelection || selectionMode === 'none') return colDefs;
        const first = colDefs[0];
        const selectCol: ColDef<T> = {
            headerName: '',
            width: 48,
            checkboxSelection: true,
            headerCheckboxSelection: selectionMode === 'multiple',
            pinned: 'left',
            lockPosition: true,
            resizable: false
        };
        if (first && (first as any).checkboxSelection) return colDefs;
        return [selectCol, ...colDefs];
    }, [colDefs, checkboxSelection, selectionMode]);

    const loadColumnState = useCallback((gridApi: GridApi) => {
        if (!persistKey) return;
        try {
            const raw = localStorage.getItem(buildPersistKey(persistKey));
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed?.columnState) {
                gridApi.applyColumnState({
                    state: parsed.columnState,
                    applyOrder: true
                });
            }
        } catch (e) {
            console.warn('Fail on loading column state', e);
        }
    }, [persistKey]);

    const saveColumnState = useCallback((gridApi: GridApi) => {
        if (!persistKey) return;
        try {
            const state = gridApi.getColumnState();
            localStorage.setItem(buildPersistKey(persistKey), JSON.stringify({
                columnState: state
            }));
        } catch (e) {
            console.warn('Fail on saving column state', e);
        }
    }, [persistKey]);

    const onGridReady = useCallback((params: GridReadyEvent<T>) => {
        internalRef.current.api = params.api;

        loadColumnState(params.api);

        if (!suppressAutoSizeOnInit && autoSizeStrategy !== 'none') {
            requestAnimationFrame(() => {
                if (autoSizeStrategy === 'fitAll') {
                    params.api.sizeColumnsToFit();
                } else if (autoSizeStrategy === 'fitVisible') {
                    const allIds = params.api.getColumns()?.map(c => c.getId());
                    if (allIds?.length) {
                        params.api.autoSizeColumns(allIds, false);
                    }
                }
            });
        }
    }, [autoSizeStrategy, loadColumnState, suppressAutoSizeOnInit]);

    useEffect(() => {
        if (rowData && rowData.length && autoSizeStrategy !== 'none') {
            const api = internalRef.current.api;
            if (api) {
                if (autoSizeStrategy === 'fitAll') {
                    api.sizeColumnsToFit();
                } else if (autoSizeStrategy === 'fitVisible') {
                    const allIds = api.getColumns()?.map(c => c.getId());
                    if (allIds?.length) {
                        api.autoSizeColumns(allIds, false);
                    }
                }
            }
        }
    }, [rowData, autoSizeStrategy]);

    const handleSelectionChanged = useCallback((e: SelectionChangedEvent<T>) => {
        if (!onSelectionChange) return;
        const selected = e.api.getSelectedRows();
        onSelectionChange(selected);
    }, [onSelectionChange]);

    const handleRowClicked = useCallback((e: RowClickedEvent<T>) => {
        if (onRowClick) onRowClick(e.data);
    }, [onRowClick]);

    const getRowId = useCallback((params: any) => {
        if (rowIdGetter) return String(rowIdGetter(params.data));
        if (params.data?.id != null) return String(params.data.id);
        return params.data?.__uuid || params.rowIndex?.toString();
    }, [rowIdGetter]);

    const gridOptions: GridOptions<T> = useMemo(() => ({
        rowSelection: selectionMode === 'multiple' ? 'multiple'
            : selectionMode === 'single' ? 'single'
                : undefined,
        suppressRowClickSelection: checkboxSelection,
        enableCellTextSelection: true,
        suppressDragLeaveHidesColumns: !enableColumnHide,
        suppressMovableColumns: !enableColumnReorder,
        suppressColumnMoveAnimation: true,
        paginationPerPage,
        rowClassRules,
        getContextMenuItems,
        accentedSort: true,
        localeText,
        onColumnMoved: () => internalRef.current.api && saveColumnState(internalRef.current.api),
        onColumnPinned: () => internalRef.current.api && saveColumnState(internalRef.current.api),
        onColumnVisible: () => internalRef.current.api && saveColumnState(internalRef.current.api),
        onColumnResized: () => internalRef.current.api && saveColumnState(internalRef.current.api),
        getRowStyle
    }), [selectionMode, checkboxSelection, enableColumnHide, enableColumnReorder, paginationPerPage, rowClassRules, getContextMenuItems, localeText, getRowStyle, saveColumnState]);

    useEffect(() => {
        if (internalRef.current.api) {
            // internalRef.current.api.setQuickFilter(quickFilterText ?? ''); // TODO: Make Quick filter work
        }
    }, [quickFilterText]);

    const themeClass = useMemo(() => {
        if (forcedTheme === 'dark') return 'ag-theme-alpine-dark';
        return 'ag-theme-alpine';
    }, [forcedTheme]);

    const showTable = !loading && !error && rowData && rowData.length > 0;

    return (
        <Box display="flex" flexDirection="column" width="100%" height={height} minHeight={minHeight}
             className={className}>
            {toolbar && (
                <Box flexShrink={0} mb={1}>
                    {toolbar}
                </Box>
            )}

            <Box position="relative" flex={1} minHeight={0}>
                {loading && <DataTableLoading/>}
                {!loading && error && <DataTableError error={error}
                                                      onRetry={() => internalRef.current.api?.refreshClientSideRowModel()}/>}
                {!loading && !error && (!rowData || rowData.length === 0) && <DataTableEmpty/>}

                {showTable && (
                    <div className={themeClass} style={{width: '100%', height: '100%'}}>
                        <AgGridReact<T>
                            ref={gridRef}
                            rowData={rowData}
                            columnDefs={mergedColDefs}
                            gridOptions={gridOptions}
                            onGridReady={onGridReady}
                            onSelectionChanged={handleSelectionChanged}
                            onRowClicked={handleRowClicked}
                            getRowId={getRowId}
                            pagination={pagination}
                            paginationPageSize={pageSize}
                            paginationPageSizeSelector={paginationPerPage}
                            suppressPaginationPanel={!pagination}
                            headerHeight={dense ? 36 : 48}
                            rowHeight={dense ? 34 : 46}
                            quickFilterText={quickFilterText}
                            animateRows
                        />
                    </div>
                )}
            </Box>

            {footer && (
                <Box flexShrink={0} mt={1}>
                    {footer}
                </Box>
            )}
        </Box>
    );
}