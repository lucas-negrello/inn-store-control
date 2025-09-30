import {type ReactNode, useEffect, useRef, useState} from "react";
import type {TFormMode} from "@app/contexts/forms/types.ts";
import {useEntityFormRouting} from "@app/hooks/forms/useEntityFormRouting.ts";
import {Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import { Close } from "@mui/icons-material";

type RouteModalProps<TData = unknown, TResult = unknown> = {
    title: ReactNode;
    openWhen: Array<TFormMode>;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;

    onOpenData?: (ctx: {mode: TFormMode; id?: string}) => Promise<TData> | TData;
    onClose?: (result?: TResult) => void;
    onAfterClose?: (result?: TResult) => void;
    keepDataOnClose?: boolean;
    children: (args: {
        mode: TFormMode;
        id?: string;
        data?: TData;
        loading: boolean;
        error?: string | null;
        setResult: (result: TResult) => void;
        close: (result?: TResult) => void;
    }) => ReactNode;
};

export function RouteModal<TData = unknown, TResult = unknown>(props: RouteModalProps<TData, TResult>) {
    const {
        title,
        openWhen,
        maxWidth = 'sm',
        fullWidth = true,
        onOpenData,
        onClose,
        onAfterClose,
        keepDataOnClose,
        children,
    } = props;

    const {
        mode,
        id,
        isModalOpen,
        closeModal,
        setModalResult
    } = useEntityFormRouting();

    const open = !!mode && openWhen.includes(mode);

    const [data, setData] = useState<TData | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const resultRef = useRef<TResult | undefined>(undefined);
    const prevOpenRef = useRef<boolean>(false);

    // Load data when modal is opened
    useEffect(() => {
        const justOpened = open && !prevOpenRef.current;
        const justClosed = !open && prevOpenRef.current;

        if (justOpened && mode && onOpenData) {
            setLoading(true);
            setError(null);
            Promise.resolve(onOpenData({mode, id}))
                .then((resp) => setData(resp))
                .catch((error) => setError(error?.message || 'Erro ao carregar dados'))
                .finally(() => setLoading(false));;
        }
        if (justClosed) {
            const result = resultRef.current;
            if (!keepDataOnClose) setData(undefined);
            if (onAfterClose) onAfterClose(result);
            resultRef.current = undefined;
        }
        prevOpenRef.current = open;
    }, [open, mode, id, onOpenData, onAfterClose, keepDataOnClose]);

    const handleClose = (result?: TResult) => {
        resultRef.current = result;
        if (onClose) onClose(result);
        if (typeof result !== "undefined")
            setModalResult(result);
        closeModal(result);
    }

    return (
        <Dialog open={open} onClose={() => handleClose(undefined)} fullWidth={fullWidth} maxWidth={maxWidth}>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {title}
                <IconButton onClick={() => handleClose(undefined)} aria-label="Fechar">
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    mode && children({
                        mode,
                        id,
                        data,
                        loading,
                        error,
                        setResult: (r) => { resultRef.current = r; },
                        close: handleClose
                    })
                )}
            </DialogContent>
        </Dialog>
    );
}