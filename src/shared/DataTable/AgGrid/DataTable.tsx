import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { type ColDef, type ColGroupDef } from 'ag-grid-community';
import {type CSSProperties, useState} from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface IAgDataTableProps<TData> {
    rowData: TData[];
    colDefs: (ColDef | ColGroupDef)[];
    containerStyle?: CSSProperties;
}

export function DataTable<TData>(dataTableProps: IAgDataTableProps<TData>) {
    const [rowData, setRowData] = useState(dataTableProps.rowData);
    const [colDefs, setColDefs] = useState(dataTableProps.colDefs);


    return (
        <div style={{ height: 500, width: '100%', ...dataTableProps.containerStyle }}>
            <AgGridReact
                containerStyle={{ innerHeight: '100%', innerWidth: '100%' }}
                rowData={rowData}
                columnDefs={colDefs}
            />
        </div>
    )
}