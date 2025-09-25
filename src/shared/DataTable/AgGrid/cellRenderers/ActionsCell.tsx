import type { ColDef } from 'ag-grid-community';
import {createRenderer, type RegisteredCellRendererParams} from "@/shared/DataTable/AgGrid";
import {type ReactNode, type MouseEvent, useEffect} from "react";
import {useMemo, useState} from "react";
import {alpha, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

export type ColAction<T = any> = {
    title: string,
    onClick?: (data: T, params: RegisteredCellRendererParams<T>) => void,
    icon?: ReactNode,
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    disabled?: boolean,
    hidden?: boolean,
    shortcutHint?: string,
}

export type ColActionsProvider<T = any> =
    | ColAction<T>[]
    | ((rowData: T, params: RegisteredCellRendererParams<T>) => ColAction<T>[]);

export interface ActionsCellExtraParams<T = any> {
    actionsProvider?: ColActionsProvider<T>;
    menuAriaLabel?: string;
    autoDisableWhenEmpty?: boolean;
    alwaysShowButton?: boolean;
}

export interface ActionsColumnOptions<T> extends Partial<ColDef<T>> {
    headerName?: string;
    width?: number;
    alwaysShowButton?: boolean;
    autoDisableWhenEmpty?: boolean;
    menuAriaLabel?: string;
}

function resolveActions<T>(params: RegisteredCellRendererParams<T> & ActionsCellExtraParams<T>): ColAction<T>[] {
    const { data, actionsProvider } = params;

    if (!actionsProvider) return params.value || [];
    if (Array.isArray(actionsProvider)) return actionsProvider;
    return actionsProvider(data as T, params);
}

export const ActionsCell = createRenderer('actions', (params: RegisteredCellRendererParams & ActionsCellExtraParams) => {
    const {
        data,
        menuAriaLabel,
        autoDisableWhenEmpty = true,
        alwaysShowButton = false
    } = params;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const actions = useMemo(
        () => resolveActions(params).filter(a => !a.hidden),
        [params]
    );

    const disabledButton =
        autoDisableWhenEmpty && actions.length === 0 && !alwaysShowButton;

    const handleOpen = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (disabledButton) return;
        setAnchorEl(e.currentTarget);
    };

    const handleClose = (e?: any) => {
        e?.stopPropagation?.();
        setAnchorEl(null);
    };

    const handleActionClick = (action: ColAction, ev: MouseEvent) => {
        ev.stopPropagation();
        handleClose();
        action.onClick?.(data, params);
    };

    useEffect(() => {
        const api = params.api;
        const closeOnScroll = () => {
            if (open) setAnchorEl(null);
        };
        api?.addEventListener('bodyScroll', closeOnScroll);
        return () => {
            api?.removeEventListener('bodyScroll', closeOnScroll);
        }
    }, [open, params.api]);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
            }}
            onClick={e => e.stopPropagation()}
        >
            <Tooltip title={disabledButton ? '' : menuAriaLabel}>
                <span>
                    <IconButton
                        size="small"
                        onClick={handleOpen}
                        disabled={disabledButton}
                        sx={{ opacity: disabledButton ? 0.35 : 1 }}
                    >
                        <MoreVert fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>
            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    list: {
                        dense: true,
                        onKeyDown: (e: any) => {
                            if (e.key === 'Escape') handleClose();
                        }
                    }
                }}
            >
                {actions.length === 0 && (
                    <MenuItem disabled>Nenhuma ação disponível</MenuItem>
                )}
                {actions.map((act, idx) => {

                    return (
                        <MenuItem
                            key={idx}
                            disabled={act.disabled}
                            onClick={e => handleActionClick(act, e)}
                            sx={{
                                '&:hover': {
                                    opacity: 0.7
                                }
                            }}
                        >
                            {act.icon && (
                                <ListItemIcon
                                    color={act.color}

                                    sx={{
                                        minWidth: 30,
                                    }}
                                >
                                    {act.icon}
                                </ListItemIcon>
                            )}
                            <ListItemText
                                slotProps={{
                                    primary: {
                                        variant: 'body2',
                                        noWrap: true,
                                        fontWeight: 600,
                                    }
                                }}
                                primary={act.title}
                            />
                            {act.shortcutHint && (
                                <span
                                    style={{
                                        fontSize: 11,
                                        opacity: 0.6,
                                        marginLeft: 8,
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {act.shortcutHint}
                                </span>
                            )}
                        </MenuItem>
                    )
                })}
            </Menu>
        </div>
    );
})