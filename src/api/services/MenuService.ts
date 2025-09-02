import {CrudFacade} from "@/api/facades/CrudFacade.ts";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";

const client = new CrudFacade<IMenuItem>('menu', 'mock', {
    storageType: 'session',
    useStorage: true,
});

export const MenuService = {
    getMenus: () => client.getAll(),
    getMenuById: (id: number | string) => client.get(id),
    createMenu: (menu: IMenuItem) => client.post(menu),
    updateMenu: (id: number | string, menu: IMenuItem) => client.update(id, menu),
    deleteMenu: (id: number | string) => client.delete(id),
}