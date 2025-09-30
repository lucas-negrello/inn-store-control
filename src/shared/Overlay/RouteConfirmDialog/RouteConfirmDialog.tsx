import {type ReactNode, useEffect} from "react";
import type {TFormMode} from "@app/contexts/forms/types.ts";
import {useEntityFormRouting} from "@app/hooks/forms/useEntityFormRouting.ts";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";

type RouteConfirmDialogProps<TResult = unknown> = {
    title: ReactNode;
    message: ReactNode;
    openWhen: Array<TFormMode>;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirmResult?: () => TResult | Promise<TResult>;
    onCancelResult?: () => TResult | Promise<TResult>;
    onAfterClose?: (result?: TResult) => void;
};

export function RouteConfirmDialog<TResult = unknown>(props: RouteConfirmDialogProps<TResult>) {
    const {
        title,
        message,
        openWhen,
        confirmLabel = 'Confirmar',
        cancelLabel = 'Cancelar',
        onConfirmResult,
        onCancelResult,
        onAfterClose,
    } = props;

    const {
        mode,
        isModalOpen,
        closeModal,
        setModalResult
    } = useEntityFormRouting();

    const open = !!mode && openWhen.includes(mode);

    useEffect(() => {
        const prevOpen = open;
        return () => {
            if (prevOpen && onAfterClose)
                onAfterClose(undefined);
        }
    }, [open, onAfterClose]);

    const handle = async (confirmed: boolean) => {
        const result = confirmed
            ? (onConfirmResult ? await onConfirmResult() : (true as unknown as TResult))
            : (onCancelResult ? await onCancelResult() : (false as unknown as TResult));
        setModalResult(result);
        closeModal(result);
    };

    return (
        <Dialog open={open} onClose={() => handle(false)} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography variant="body1">{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handle(false)}>{cancelLabel}</Button>
                <Button variant="contained" color="error" onClick={() => handle(true)}>
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}