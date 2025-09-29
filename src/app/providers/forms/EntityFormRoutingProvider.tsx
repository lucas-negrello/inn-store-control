import type {IEntityFormRoutingProviderProps} from "@app/providers/forms/types.ts";
import {EntityFormRoutingContext} from "@app/contexts/forms/EntityFormRoutingContext.tsx";
import type {IEntityFormRoutingContext} from "@app/contexts/forms/types.ts";
import {useCallback, useMemo, useState} from "react";
import {useLocation, useMatch, useNavigate, useParams} from "react-router-dom";

export const EntityFormRoutingProvider = ({children}: IEntityFormRoutingProviderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const [basePath, setBasePath] = useState<string>('');

    const createMatch = useMatch(`/${basePath}/create`);
    const viewMatch = useMatch(`/${basePath}/view/:id`);
    const editMatch = useMatch(`/${basePath}/edit/:id`);

    const id = params.id;

    const mode = createMatch ? 'create' : viewMatch ? 'view' : editMatch ? 'edit' : null;

    const isModalOpen = mode === "create" || mode === "edit";

    const goTo = useCallback((path: string) => navigate(path), [navigate]);

    const value: IEntityFormRoutingContext = useMemo(() => ({
        mode,
        id,
        isModalOpen,
        openCreate: () => goTo(`/${basePath}/create`),
        openView: (id: string | number) => goTo(`/${basePath}/view/${id}`),
        openEdit: (id: string | number) => goTo(`/${basePath}/edit/${id}`),
        closeModal: () => goTo(`/${basePath}`),
        basePath,
        setBasePath,
    }), [mode, id, isModalOpen, basePath, setBasePath, goTo]);

    return (
        <EntityFormRoutingContext.Provider value={value}>
            {children}
        </EntityFormRoutingContext.Provider>
    );
}