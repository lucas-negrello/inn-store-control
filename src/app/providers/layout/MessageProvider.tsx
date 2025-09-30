import type {IMessageProps} from "@app/providers/layout/types.ts";
import {useMemo, useState} from "react";
import type {IMessageContext} from "@app/contexts/layout/types.ts";
import {MessageContext} from "@app/contexts/layout/MessageContext.tsx";
import { Snackbar } from "@mui/material";

export const MessageProvider = ({ children }: IMessageProps) => {
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState<string>("");
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
    const [snackDuration, setSnackDuration] = useState<number | undefined>(1500);

    const value: IMessageContext = useMemo(() => ({
        open: snackOpen,
        setOpen: setSnackOpen,
        message: snackMessage,
        setMessage: setSnackMessage,
        severity: snackSeverity,
        setSeverity: setSnackSeverity,
        timer: snackDuration,
        setTimer: setSnackDuration,
    }), [snackOpen, snackMessage, snackSeverity, snackDuration]);

    return (
        <MessageContext.Provider value={value}>
            {children}
            <Snackbar
                message={snackMessage}
                open={snackOpen}
                onClose={() => setSnackOpen(false)}
                autoHideDuration={snackDuration}
                color={snackSeverity}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
        </MessageContext.Provider>

    );

}