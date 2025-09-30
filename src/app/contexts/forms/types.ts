export type TFormMode = keyof typeof CFormMode;
export interface IEntityFormRoutingContext<TResult = unknown> {
    basePath: string;
    mode: TFormMode | null;
    id?: string;

    isModalOpen: boolean;

    openCreate: () => void;
    openView: (id: string | number) => void;
    openEdit: (id: string | number) => void;
    closeModal: (result: TResult) => void;

    modalResult?: TResult;
    setModalResult: (result: TResult) => void;
    clearModalResult: () => void;
}

export const CFormMode = {
    create: 'create',
    edit: 'edit',
    view: 'view',
} as const;