import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import {MenuFacade} from "@/api/facades/MenuFacade.ts";

const client = new MenuFacade('menu', 'local', {
    storageType: 'session',
    useStorage: true,
    cacheTTL: 60*60, // 1 hour
});

export const MenuService = {
    getMenus: () => client.getAll(),
    getMenuById: (id: number | string) => client.get(id),
    createMenu: (menu: IMenuItem) => client.post(menu),
    updateMenu: (id: number | string, menu: IMenuItem) => client.update(id, menu),
    deleteMenu: (id: number | string) => client.delete(id),
    getFlatMenu: (withInactive = false) => client.getFlatMenu(withInactive),
    getMenuTree: (withInactive = false) => client.getMenuTree(withInactive),
    getMenuTreeByUser: (userId: number | string, withInactive = false) => client.getMenuTreeByUser(userId, withInactive),
}