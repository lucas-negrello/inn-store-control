import type {DataSource, DataSourceParams, DataSourceResult} from "@/shared/DataTable/AgGrid/DataTableTypes.ts";

export function buildHttpDataSource<T>(endpoint: string, fetcher: (url: string, init?: RequestInit) => Promise<any>): DataSource<T> {
    return async (params: DataSourceParams): Promise<DataSourceResult<T>> => {
        const query = new URLSearchParams();
        query.set('page', String(params.page + 1));
        query.set('pageSize', String(params.pageSize));

        if (params.sortModel?.length) {
            const sortPart = params.sortModel
                .map((s: any) => `${s.colId}:${s.sort}`).join(',');
            query.set('sort', sortPart);
        }

        const url = `${endpoint}?${query.toString()}`;
        const json = await fetcher(url);

        return {
            rows: json.data ?? json.items ?? [],
            total: json.total ?? json.meta?.total ?? 0
        };
    }
}