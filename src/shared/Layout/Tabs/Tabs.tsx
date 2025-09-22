import {type FC, type ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Box, type SxProps, Tab, Tabs, Tooltip} from "@mui/material";
import {useSearchParams} from "react-router-dom";

export interface IPageTabConfig {
    id: string | number;
    label: string;
    render: () => ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
    tooltip?: string;
    lazy?: boolean;
    keepAlive?: boolean;
    ariaLabel?: string;
}

export interface IPageTabsProps {
    tabs: IPageTabConfig[];
    defaultTabId?: string | number;
    queryParam?: string;
    syncToUrl?: boolean;
    keepAlive?: boolean;
    lazyByDefault?: boolean;
    variant?: TPagePropsVariant;
    stretchLabels?: boolean;
    onChange?: (activeId: string | number) => void;
    tabsSx?: SxProps;
    tabSx?: SxProps;
    contentContainerSx?: SxProps;
    idPrefix?: string;
    disableUrlReplace?: boolean;
}

export type TPagePropsVariant = keyof typeof CPageTabsPropsVariant;
export const CPageTabsPropsVariant = {
    standalone: 'standalone',
    scrollable: 'scrollable',
    fullWidth: 'fullWidth',
} as const;

export const PageTabs: FC<IPageTabsProps> = ({
    tabs,
    defaultTabId,
    queryParam = 'tab',
    syncToUrl = true,
    keepAlive = true,
    lazyByDefault = true,
    variant = 'scrollable',
    stretchLabels = false,
    onChange,
    tabsSx,
    tabSx,
    contentContainerSx,
    idPrefix = 'page-tabs',
    disableUrlReplace = false,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialResolved = useRef(false);

    const safeTabs = tabs.filter(Boolean);
    if (safeTabs.length === 0) {
        console.warn('PageTabs: No tabs provided');
    }

    const firstTabId = safeTabs[0]?.id;
    const resolvedDefaultId =
        defaultTabId &&
        safeTabs.some(t => t.id === defaultTabId)
            ? defaultTabId
            : firstTabId;

    const queryValue = syncToUrl ? searchParams.get(queryParam) : null;

    const effectiveActiveId = useMemo(() => {
        if (!syncToUrl || !queryValue) return resolvedDefaultId;
        return safeTabs.some(t => t.id.toString() === queryValue)
            ? queryValue
            : resolvedDefaultId;
    }, [queryValue, resolvedDefaultId, safeTabs, syncToUrl]);

    const [activeId, setActiveId] = useState<string | number | undefined>(effectiveActiveId);

    useEffect(() => {
        if (activeId !== effectiveActiveId) {
            setActiveId(effectiveActiveId);
        }
    }, [effectiveActiveId]);

    const [loadedTabs, setLoadedTabs] = useState<Set<string | number>>(() => {
        const s = new Set<string | number>();
        if (activeId) s.add(activeId);
        return s;
    });

    useEffect(() => {
        if (activeId) {
            setLoadedTabs(prev => {
                if (prev.has(activeId)) return prev;
                const clone = new Set(prev);
                clone.add(activeId);
                return clone;
            });
        }
    }, [activeId]);

    const pushToUrl = useCallback((id: string | number) => {
        if (!syncToUrl) return;
        const current = new URLSearchParams(searchParams);
        current.set(queryParam, id.toString());
        setSearchParams(current, {replace: !disableUrlReplace});
    }, [syncToUrl, searchParams, queryParam, setSearchParams, disableUrlReplace]);

    const handleActivate = useCallback((id: string | number) => {
        setActiveId(id);
        pushToUrl(id);
        onChange?.(id);
    }, [onChange, pushToUrl]);

    useEffect(() => {
        if (initialResolved.current) return;
        initialResolved.current = true;
        if (syncToUrl) {
            if (!queryValue || !safeTabs.some(t => t.id.toString() === queryValue)) {
                if (resolvedDefaultId) pushToUrl(resolvedDefaultId);
            }
        }
    }, [syncToUrl, queryValue, safeTabs, resolvedDefaultId, pushToUrl]);

    const renderTabLabel = (tab: IPageTabConfig) => {
        const labelContent = (
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    minHeight: 35
                }}
            >
                {tab.icon}
                <span>{tab.label}</span>
            </Box>
        );

        if (tab.tooltip) {
            return (
                <Tooltip title={tab.tooltip}>
                    {labelContent}
                </Tooltip>
            );
        }
        return labelContent;
    };

    const activeTab = safeTabs.find(t => t.id === activeId) || safeTabs[0];

    const shouldRenderTabContent = (tab: IPageTabConfig) => {
        const isActive = tab.id === activeId;
        const effectiveLazy = tab.lazy ?? lazyByDefault;
        const effectiveKeepAlive = tab.keepAlive ?? keepAlive;

        if (!effectiveLazy) return true;
        if (isActive) return true;
        if (effectiveKeepAlive && loadedTabs.has(tab.id)) return true;
        return false;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Tabs
                value={activeId}
                onChange={(_, newValue: string) => handleActivate(newValue)}
                variant={variant === 'fullWidth' ? 'fullWidth' : 'scrollable'}
                scrollButtons={variant === 'scrollable' ? 'auto' : undefined}
                sx={{
                    minHeight: 40,
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        minHeight: 40,
                        flex: stretchLabels ? 1 : 'initial',
                    },
                    ...tabsSx
                }}
            >
                {safeTabs.map((tab: IPageTabConfig) => (
                    <Tab
                        key={tab.id}
                        value={tab.id}
                        disabled={tab.disabled}
                        label={renderTabLabel(tab)}
                        id={`${idPrefix}-tab-${tab.id}`}
                        aria-controls={`${idPrefix}-panel-${tab.id}`}
                        sx={tabSx}
                    />
                ))}
            </Tabs>
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    flex: 1,
                    ...contentContainerSx
                }}
            >
                {safeTabs.map((tab: IPageTabConfig) => {
                    if (!shouldRenderTabContent(tab)) return null;
                    const isActive = tab.id === activeId;
                    return (
                        <Box
                            key={tab.id}
                            role="tabpanel"
                            id={`${idPrefix}-panel-${tab.id}`}
                            aria-labelledby={`${idPrefix}-tab-${tab.id}`}
                            hidden={!isActive}
                            sx={{
                                width: '100%',
                                height: '100%',
                                ...(isActive ? {} : {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    visibility: 'hidden',
                                    pointerEvents: 'none',
                                })
                            }}
                        >
                            {tab.render()}
                        </Box>
                    );
                })}

                {!activeTab && safeTabs.length > 0 && (
                    <Box sx={{ p: 2, color: 'text.secondary' }}>
                        Nenhuma aba ativa!
                    </Box>
                )}
            </Box>
        </Box>
    );

}