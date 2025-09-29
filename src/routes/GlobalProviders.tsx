import {LocalDbGate} from "@/infrastructure/localDb/providers/LocalDbGate.tsx";
import {LayoutProvider} from "@app/providers/layout/LayoutProvider.tsx";
import {ThemeProvider} from "@app/providers/layout/ThemeProvider.tsx";
import type {FC, ReactNode} from "react";
import {AppProvider} from "@app/providers/params/AppProvider.tsx";
import {PermissionProvider} from "@app/providers/params/PermissionProvider.tsx";
import {EntityFormRoutingProvider} from "@app/providers/forms/EntityFormRoutingProvider.tsx";

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
                            <EntityFormRoutingProvider>
                                {children}
                            </EntityFormRoutingProvider>
                        </PermissionProvider>
                    </AppProvider>
                </LocalDbGate>
            </LayoutProvider>
        </ThemeProvider>
    );
}

export default GlobalProviders;