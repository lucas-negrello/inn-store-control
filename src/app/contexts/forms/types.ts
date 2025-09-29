export type TFormMode = keyof typeof CFormMode;
export interface IEntityFormRoutingContext {
    mode: TFormMode | null;
    id?: string;
    isModalOpen: boolean;
    openCreate: () => void;
    openView: (id: string | number) => void;
    openEdit: (id: string | number) => void;
    closeModal: () => void;
    setBasePath: (path: string) => void;
    basePath: string;
}

export const CFormMode = {
    create: 'create',
    edit: 'edit',
    view: 'view',
} as const;