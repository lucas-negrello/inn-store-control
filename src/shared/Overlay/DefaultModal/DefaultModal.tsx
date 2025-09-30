import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

type DefaultModalProps<TData = unknown, TResult = unknown> = {
    title: ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    open: boolean;
    setOpen: (open: boolean) => void;
    onOpen?: () => Promise<TData> | TData;
    onClose?: (result?: TResult) => void;
    onAfterClose?: (result?: TResult) => void;
    keepDataOnClose?: boolean;
    children: (args: {
        data?: TData;
        loading: boolean;
        error?: string | null;
        setResult: (result: TResult) => void;
        close: (result?: TResult) => void;
    }) => ReactNode;
};

export function DefaultModal<TData = unknown, TResult = unknown>(props: DefaultModalProps<TData, TResult>) {
    const {
        title,
        maxWidth = 'sm',
        fullWidth = true,
        open,
        setOpen,
        onOpen,
        onClose,
        onAfterClose,
        keepDataOnClose,
        children,
    } = props;

    const [data, setData] = useState<TData | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const resultRef = useRef<TResult | undefined>(undefined);
    const prevOpenRef = useRef<boolean>(false);

    useEffect(() => {
        if (open && !prevOpenRef.current && onOpen) {
            setLoading(true);
            Promise.resolve(onOpen())
                .then(setData)
                .catch(e => setError(e?.message || "Erro ao carregar dados"))
                .finally(() => setLoading(false));
        }
        if (!open && prevOpenRef.current) {
            const result = resultRef.current;
            if (!keepDataOnClose) setData(undefined);
            if (onAfterClose) onAfterClose(result);
            resultRef.current = undefined;
        }
        prevOpenRef.current = open;
    }, [open, onOpen, onAfterClose, keepDataOnClose]);

    const handleClose = (result?: TResult) => {
        resultRef.current = result;
        if (onClose) onClose(result);
        setOpen(false);
    };

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
                    children({
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