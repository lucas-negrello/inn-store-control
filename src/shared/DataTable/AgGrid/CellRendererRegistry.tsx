import type {CellRendererRegistration, TCellRendererMap} from "@/shared/DataTable/AgGrid/DataTableTypes.ts";

class CellRendererRegistry {
    private _map = new Map<TCellRendererMap, CellRendererRegistration>();

    register =
        (reg: CellRendererRegistration) =>
            this._map.set(reg.name, reg);

    unregister =
        (name: TCellRendererMap) =>
            this._map.delete(name);

    get =
        (name: TCellRendererMap) =>
            this._map.get(name);

    list =
        () =>
            Array.from(this._map.values());
}

export const cellRenderRegistry = new CellRendererRegistry();

export const createRenderer =
    <T,>(name: TCellRendererMap, renderer: CellRendererRegistration<T>['renderer'], priority = 0): CellRendererRegistration =>
        ({
            name,
            renderer,
            priority
        });