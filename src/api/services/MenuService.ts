import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import {MenuFacade} from "@/api/facades/MenuFacade.ts";

const client = new MenuFacade();

export const MenuService = {
    getMenus: async () => await client.getAll(),
    getMenuById: async (id: number | string) => await client.get(id),
    createMenu: async (menu: IMenuItem) => await client.post(menu),
    updateMenu: async (id: number | string, menu: IMenuItem) => await client.update(id, menu),
    deleteMenu: async (id: number | string) => await client.delete(id),
    getFlatMenu: async (withInactive = false) => await client.getFlatMenu(withInactive),
    getMenuTree: async (withInactive = false) => await client.getMenuTree(withInactive),
    getMenuTreeByUser: async (userId: number | string, withInactive = false) => await client.getMenuTreeByUser(userId, withInactive),
}