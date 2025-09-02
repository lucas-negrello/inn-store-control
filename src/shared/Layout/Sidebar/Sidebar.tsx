import {useCallback, useEffect, useState} from "react";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import {MenuService} from "@/api/services/MenuService.ts";
import {
    Alert,
    Box,
    CircularProgress,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    type SxProps
} from "@mui/material";
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
    const {userId, user, isAuthenticated} = useApp();
    const {canAccessRoute} = usePermissions();
    const [loading, setLoading] = useState<boolean>(true);
    const [sidebarItems, setSidebarItems] = useState<IMenuItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const loadMenuItems = useCallback(async () => {
        if (!isAuthenticated || !user) {
            setSidebarItems([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await MenuService.getMenus();

            if (res.success && res.data) {
                const filteredItems = res.data.filter((item: IMenuItem) => {
                    try {
                        if (!item.isActive) return false;

                        if (!item.roles || item.roles.length === 0) return true;

                        return canAccessRoute(item.roles.flatMap(r => r.name), item.permissions);
                    } catch (error) {
                        console.error('Error filtering menu items:', error);
                        return false;
                    }
                });

                setSidebarItems(filteredItems);
            } else {
                setSidebarItems([]);
                setError('Erro ao Carregar itens do Menu');
            }
        } catch (error) {
            console.error('Erro ao Carregar menu:', error);
            setSidebarItems([]);
            setError('Erro ao Carregar Menu');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user, canAccessRoute]);

    useEffect(() => {
        loadMenuItems();
    }, [loadMenuItems]);

    const handleNavigation = useCallback((route: string) => {
        try {
            if (!userId) {
                navigate('/');
                closeSidebar();
                return;
            }
            const path = route === '' ? `/${userId}` : `/${userId}/${route}`;
            navigate(path);
            closeSidebar();
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }, [userId, navigate, closeSidebar]);

    if (loading) {
        return (
            <Drawer open={isSidebarOpen} onClose={closeSidebar}>
                <Box sx={{ width: 250, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
                    <CircularProgress />
                </Box>
            </Drawer>
        );
    }

    if (error) {
        return (
            <Drawer open={isSidebarOpen} onClose={closeSidebar}>
                <Box sx={{ width: 250, p: 2 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            </Drawer>
        );
    }

    return (
        <Drawer open={isSidebarOpen} onClick={closeSidebar}>
            <List sx={{width: 250}}>
                {sidebarItems.length === 0 ? (
                    <Box sx={{ p: 2 }}>
                        <Alert severity="info">Nenhum item de menu disponível</Alert>
                    </Box>
                ) : (
                    sidebarItems.map((item) => (
                        <ListItem sx={menuStyles} key={item.id} onClick={() => handleNavigation(item.route)}>
                            <ListItemIcon>
                                <DynamicIcon iconName={item.icon} />
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    ))
                )}
            </List>
        </Drawer>
    );

}