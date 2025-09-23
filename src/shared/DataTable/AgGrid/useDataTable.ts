import type {
    DataSource,
    DataSourceParams,
    DataSourceResult,
    UseDataTableHook
} from "@/shared/DataTable/AgGrid/DataTableTypes.ts";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";

interface UseDataTableOptions<T> {
    serverSide?: boolean;
    serverSource?: DataSource<T>;
    pageSize?: number;
    initialPage?: number;
}

export function useDataTable<T>(options: UseDataTableOptions<T>): UseDataTableHook<T> {
    const {
        serverSide = false,
        serverSource,
        pageSize = 15,
        initialPage = 0
    } = options;

    const [page, setPage] = useState(initialPage);
    const [rows, setRows] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(serverSide);
    const [error, setError] = useState<string | null>(null);
    const sortModelRef = useRef<any[]>([]);
    const filterModelRef = useRef<any>({});

    const totalPages = useMemo(() => {
        if (!serverSide) return 1;
        return pageSize > 0 ? Math.ceil(total / pageSize) : 1;
    }, [serverSide, total, pageSize]);

    const fetchData = useCallback(async () => {
        if (!serverSide || !serverSource) return;
        setLoading(true);
        setError(null);
        try {
            const params: DataSourceParams = {
                page,
                pageSize,
                sortModel: sortModelRef.current,
                filterModel: filterModelRef.current,
            };
            const result: DataSourceResult<T> = await serverSource(params);
            setRows(result.rows);
            setTotal(result.total);
        } catch (error: any) {
            setError(error?.message ?? 'Error fetching data');
            setRows([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, serverSide, serverSource]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onSortChanged = (model: any[]) => {
        sortModelRef.current = model;
        if (serverSide) {
            setPage(0);
            fetchData();
        }
    };

    const onFilterChanged = (model: any) => {
        filterModelRef.current = model;
        if (serverSide) {
            setPage(0);
            fetchData();
        }
    };

    return {
        page,
        setPage,
        total,
        totalPages,
        pageSize,
        rows,
        setRows,
        loading,
        setLoading,
        error,
        setError,
        onSortChanged,
        onFilterChanged,
        refetch: fetchData,
    };
}