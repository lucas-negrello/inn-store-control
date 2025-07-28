import {useEffect, useState} from "react";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import {MenuService} from "@/api/services/MenuService.ts";
import {Drawer, List, ListItem, ListItemText, type SxProps} from "@mui/material";
import {useLayout} from "@app/hooks/layout/useLayout.ts";

const menuStyles: SxProps = {
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#d0d0d088',
    },
    '&.Mui-selected': {
        backgroundColor: '#d0d0d0',
    },
};

export const Sidebar = () => {
    const {isSidebarOpen, closeSidebar} = useLayout();
    const [loading, setLoading] = useState<boolean>(true);
    const [sidebarItems, setSidebarItems] = useState<IMenuItem[]>([]);

    useEffect(() => {
        MenuService.getMenus()
            .then((res) => setSidebarItems(res.data))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Drawer open={isSidebarOpen} onClick={closeSidebar}>
            {loading ?
                (
                    <div>Loading...</div>
                ) :
                (
                    <List sx={{width: 250}}>
                        {sidebarItems.map((item) => (
                            <ListItem sx={menuStyles} key={item.id} onClick={closeSidebar}>
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </List>
                )}
        </Drawer>
    );

}