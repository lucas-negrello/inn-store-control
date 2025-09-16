import {LocalDbGate} from "@/infrastructure/localDb/providers/LocalDbGate.tsx";
import {LayoutProvider} from "@app/providers/layout/LayoutProvider.tsx";
import {ThemeProvider} from "@app/providers/layout/ThemeProvider.tsx";
import type {FC, ReactNode} from "react";
import {AppProvider} from "@app/providers/params/AppProvider.tsx";
import {PermissionProvider} from "@app/providers/params/PermissionProvider.tsx";

type IGlobalProvidersProps = {
    children: ReactNode;
}

const GlobalProviders: FC<IGlobalProvidersProps> = ({children})=> {
    return (
        <ThemeProvider>
            <LayoutProvider>
                <LocalDbGate>
                    <AppProvider>
                        <PermissionProvider>
                            {children}
                        </PermissionProvider>
                    </AppProvider>
                </LocalDbGate>
            </LayoutProvider>
        </ThemeProvider>
    );
}

export default GlobalProviders;