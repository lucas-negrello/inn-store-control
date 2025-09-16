import {useCallback, useEffect, useState} from "react";
import type {IMenuItem} from "@/api/models/Menu.interface.ts";
import {MenuService} from "@/api/services/MenuService.ts";
import {
    Alert,
    Box,
    CircularProgress, Collapse,
    Drawer,
    List,
    ListItem, ListItemButton,
    ListItemIcon,
    ListItemText,
    type SxProps
} from "@mui/material";
import {useLayout} from "@app/hooks/layout/useLayout.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {DynamicIcon} from "@/shared/Icon/DynamicIcon/DynamicIcon.tsx";
import {useApp} from "@app/hooks/params/useApp.ts";
import {usePermissions} from "@app/hooks/params/usePermissions.ts";
import type {IRole} from "@/api/models/Roles.interface.ts";
import type {IPermission} from "@/api/models/Permissions.interface.ts";
import {ExpandLess, ExpandMore} from "@mui/icons-material";

const menuStyles: SxProps = {
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#d0d0d088',
    },
    '&.Mui-selected': {
        backgroundColor: '#d0d0d0',
    },
};

type CanAccessFn = (roles?: string[], permissions?: string[]) => boolean;
type MenuTreeProps = {
    items: IMenuItem[];
    depth?: number;
    expanded: Set<number | string>;
    onToggle: (id: number | string) => void;
    onNavigate: (route: string) => void;
    toFullPath: (route: string) => string;
    currentPath: string;
}

const normalizeKeys = (item: IMenuItem) => {
    const roles = (item.roles ?? []).map((r: IRole) => r?.slug).filter(Boolean);
    const permissions = (item.permissions ?? []).map((p: IPermission) => p?.key).filter(Boolean);
    return {roles, permissions};
};

const sortByOrder = (a: IMenuItem, b: IMenuItem) => {
    const ao = typeof a.sort_order === 'number' ? a.sort_order : 0;
    const bo = typeof b.sort_order === 'number' ? b.sort_order : 0;
    return ao - bo;
};

const filterAndSortTree = (items: IMenuItem[], canAccessRoute: CanAccessFn): IMenuItem[] => {
    const result: IMenuItem[] = [];

    for (const item of items) {
        if (!item.isActive) continue;

        const {roles, permissions} = normalizeKeys(item);

        const selfAllowed =
            ((roles.length === 0) && (permissions.length === 0)) ||
            canAccessRoute(roles, permissions);

        const children = Array.isArray(item.children) ? item.children : [];

        const filteredChildren = children.length
            ? filterAndSortTree(children, canAccessRoute)
            : [];

        if (selfAllowed || filteredChildren.length > 0) {
            result.push({
                ...item,
                children: filteredChildren.sort(sortByOrder)
            });
        }
    }

    return result.sort(sortByOrder);
}

const findPathIdsByFullPath =
    (
        items: IMenuItem[],
        toFullPath: (route: string) => string,
        currentPath: string,
        acc: (number | string)[] = []): (number | string)[] | null =>
    {
        for (const item of items) {
            const newAcc = [...acc, item.id!];
            const isMatch = toFullPath(item.route) === currentPath;

            if (isMatch) return newAcc;

            if (item.children && item.children.length > 0) {
                const found = findPathIdsByFullPath(
                    item.children, toFullPath, currentPath, newAcc
                );
                if (found) return found;
            }
        }
        return null;
    };

const MenuTree =
    ({items, depth = 0, expanded, onToggle, onNavigate, toFullPath, currentPath}: MenuTreeProps) => (
        <List component="div" disablePadding>
            {items.map((item) => {
                const hasChildren = !!(item.children && item.children.length > 0);
                const isExpanded = expanded.has(item.id!);
                const fullPath = toFullPath(item.route);
                const isSelected = fullPath === currentPath;

                return (
                    <Box key={item.id}>
                        <ListItemButton
                            sx={{ ...menuStyles, pl: 2 + depth * 2 }}
                            selected={isSelected}
                            onClick={() => {
                                if (hasChildren) {
                                    onToggle(item.id!);
                                } else {
                                    onNavigate(item.route);
                                }
                            }}
                        >
                            {item.icon && (
                                <ListItemIcon>
                                    <DynamicIcon iconName={item.icon} />
                                </ListItemIcon>
                            )}
                            <ListItemText primary={item.label} />
                            {hasChildren ? (isExpanded ? <ExpandLess /> : <ExpandMore />) : null}
                        </ListItemButton>

                        {hasChildren && (
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <MenuTree
                                    items={item.children!}
                                    depth={depth + 1}
                                    expanded={expanded}
                                    onToggle={onToggle}
                                    onNavigate={onNavigate}
                                    toFullPath={toFullPath}
                                    currentPath={currentPath}
                                />
                            </Collapse>
                        )}
                    </Box>
                );
            })}
        </List>
    );

export const Sidebar = () => {
    const {isSidebarOpen, closeSidebar} = useLayout();
    const {userId, user, isAuthenticated, checkAuth} = useApp();
    const {canAccessRoute} = usePermissions();
    const [loading, setLoading] = useState<boolean>(true);
    const [sidebarItems, setSidebarItems] = useState<IMenuItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<Set<number | string>>(new Set());
    const navigate = useNavigate();
    const location = useLocation();

    const toFullPath = useCallback((route: string) => {
        if (!userId) return route;
        return route === '/dashboard' ? `/${userId}` : `/${userId}${route}`;
    }, [userId]);

    const handleNavigation = useCallback(async (route: string) => {
        try {
            await checkAuth();
            if (!userId) {
                navigate('/');
                closeSidebar();
                return;
            }
            const path = toFullPath(route);
            navigate(path);
            closeSidebar();
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }, [userId, navigate, closeSidebar, checkAuth, toFullPath]);

    const toggleExpand = useCallback((id: number | string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const loadMenuItems = useCallback(async () => {
        if (!isAuthenticated || !user) {
            setSidebarItems([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await MenuService.getMenuTreeByUser(userId!);

            if (res.success && res.data) {
                const filtered = filterAndSortTree(res.data, canAccessRoute);
                setSidebarItems(filtered);
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
    }, [isAuthenticated, user, userId, canAccessRoute]);

    useEffect(() => {
        loadMenuItems();
    }, [loadMenuItems]);

    useEffect(() => {
        if (!sidebarItems.length) {
            setExpandedIds(new Set());
            return;
        }

        const currentPath = location.pathname;
        const pathIds = findPathIdsByFullPath(sidebarItems, toFullPath, currentPath);

        if (pathIds && pathIds.length > 1) {
            setExpandedIds(new Set(pathIds.slice(0, -1)));
        }
    }, [location.pathname, sidebarItems, toFullPath]);

    if (loading) {
        return (
            <Drawer open={isSidebarOpen} onClose={closeSidebar}>
                <Box sx={{width: 250, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200}}>
                    <CircularProgress/>
                </Box>
            </Drawer>
        );
    }

    if (error) {
        return (
            <Drawer open={isSidebarOpen} onClose={closeSidebar}>
                <Box sx={{width: 250, p: 2}}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            </Drawer>
        );
    }

    return (
        <Drawer open={isSidebarOpen} onClose={closeSidebar}>
            <List sx={{width: 250}}>
                {sidebarItems.length === 0 ? (
                    <Box sx={{p: 2}}>
                        <Alert severity="info">Nenhum item de menu disponível</Alert>
                    </Box>
                ) : (
                    <Box sx={{ width: 250 }}>
                        <MenuTree
                            items={sidebarItems}
                            expanded={expandedIds}
                            onToggle={toggleExpand}
                            onNavigate={handleNavigation}
                            toFullPath={toFullPath}
                            currentPath={location.pathname}
                        />
                    </Box>
                )}
            </List>
        </Drawer>
    );

}