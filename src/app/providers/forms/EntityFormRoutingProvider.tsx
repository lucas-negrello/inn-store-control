import type {IEntityFormRoutingProviderProps} from "@app/providers/forms/types.ts";
import {EntityFormRoutingContext} from "@app/contexts/forms/EntityFormRoutingContext.tsx";
import type {IEntityFormRoutingContext} from "@app/contexts/forms/types.ts";
import {useCallback, useMemo, useState} from "react";
import {useMatch, useNavigate, useParams} from "react-router-dom";

export const EntityFormRoutingProvider = ({children, basePath}: IEntityFormRoutingProviderProps) => {
    const navigate = useNavigate();
    const params = useParams();

    const createMatch = useMatch(`/${basePath}/create`);
    const viewMatch = useMatch(`/${basePath}/:id/view`);
    const editMatch = useMatch(`/${basePath}/:id/edit`);

    const id = params.id;

    const mode = createMatch ? 'create' : viewMatch ? 'view' : editMatch ? 'edit' : null;

    const isModalOpen = mode === "create" || mode === "edit";

    const [modalResult, setModalResultState] = useState<unknown>(undefined);
    const setModalResult = (r?: unknown) => setModalResultState(r);
    const clearModalResult = () => setModalResultState(undefined);

    const openCreate = useCallback(() => navigate(`/${basePath}/create`), [navigate, basePath]);
    const openView = useCallback((id: string | number) => navigate(`/${basePath}/${id}/view`), [navigate, basePath]);
    const openEdit = useCallback((id: string | number) => navigate(`/${basePath}/${id}/edit`), [navigate, basePath]);
    const closeModal = useCallback((result?: unknown) => {
        if (typeof result !== "undefined") {
            setModalResult(result);
        }
        navigate(`/${basePath}`)
    }, [navigate, basePath]);

    const value: IEntityFormRoutingContext = useMemo(() => ({
        basePath,
        mode,
        id,
        isModalOpen,
        openCreate,
        openView,
        openEdit,
        closeModal,
        modalResult,
        setModalResult,
        clearModalResult,
    }), [mode, id, isModalOpen, basePath, openCreate, openView, openEdit, closeModal, modalResult]);

    return (
        <EntityFormRoutingContext.Provider value={value}>
            {children}
        </EntityFormRoutingContext.Provider>
    );
}