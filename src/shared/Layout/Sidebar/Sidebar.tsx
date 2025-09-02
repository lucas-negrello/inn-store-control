import {useEffect, useState} from "react";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import {MenuService} from "@/api/services/MenuService.ts";
import {Drawer, List, ListItem, ListItemIcon, ListItemText, type SxProps} from "@mui/material";
import {useLayout} from "@app/hooks/layout/useLayout.ts";
import {useNavigate} from "react-router-dom";
import {DynamicIcon} from "@/shared/Icon/DynamicIcon/DynamicIcon.tsx";
import {useApp} from "@app/hooks/params/useApp.ts";
import {usePermissions} from "@app/hooks/params/usePermissions.ts";

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
    const {userId} = useApp();
    const {canAccessRoute} = usePermissions();
    const [loading, setLoading] = useState<boolean>(true);
    const [sidebarItems, setSidebarItems] = useState<IMenuItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        MenuService.getMenus()
            .then((res) => {
                if (!res.success) {
                    setSidebarItems([]);
                    return res;
                }
                const filteredItems = res.data.filter((item: IMenuItem) => {
                    if (!item.isActive) return false;
                    return canAccessRoute(item.roles.flatMap(i => i.name), item.permissions);
                });
                setSidebarItems(filteredItems);
            })
            .catch((err) => {
                console.log(err);
                setSidebarItems([]);
            })
            .finally(() => setLoading(false));
    }, [canAccessRoute]);

    const handleNavigation = (route: string) => {
        if (!userId) {
            navigate('/');
            closeSidebar();
            return;
        }
        const path = route === '' ? `/${userId}` : `/${userId}/${route}`;
        navigate(path);
        closeSidebar();
    };

    return (
        <Drawer open={isSidebarOpen} onClick={closeSidebar}>
            {loading ?
                (
                    <div>Loading...</div>
                ) :
                (
                    <List sx={{width: 250}}>
                        {sidebarItems.map((item) => (
                            <ListItem sx={menuStyles} key={item.id} onClick={() => handleNavigation(item.route)}>
                                <ListItemIcon>
                                    <DynamicIcon iconName={item.icon} />
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </List>
                )}
        </Drawer>
    );

}