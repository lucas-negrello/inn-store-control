import {RouteModal} from "@/shared/Overlay/RouteModal/RouteModal.tsx";
import type {IUser} from "@/api/models/Users.interface.ts";
import {useAdminPage} from "@/pages/private/admin/AdminPageHook.tsx";
import type {TFormMode} from "@app/contexts/forms/types.ts";
import UsersForm from "@/pages/private/admin/users/form/UsersForm.tsx";

export default function UsersFormRouteModal() {
    const { createUser, updateUser, getUser } = useAdminPage();

    const onOpenData = async ({mode, id}: { mode: TFormMode, id?: string }) =>
    {
        if (mode === "edit" && id) {
            const data = await getUser(id);
            return data || undefined;
        }
        if (mode === "view" && id) {
            const data = await getUser(id);
            return data || undefined;
        }
    }

    return (
        <RouteModal<IUser | undefined, { saved?: IUser } | void>
            title="Usuário"
            openWhen={['create', 'edit', 'view']}
            onOpenData={onOpenData}
        >
            {({ mode, id, data, loading, error, close}) => {
                const isCreate = mode === 'create';
                const isEdit = mode === 'edit';
                const isView = mode === 'view';
                const handleSubmit = async (values: IUser) => {
                    if (isCreate) {
                        const saved = await createUser(values);
                        close({ saved: saved || undefined });
                    } else if (id && isEdit) {
                        const saved = await updateUser(id, values);
                        close({saved: saved || undefined});
                    } else if (id && isView) {
                        const saved = await getUser(id);
                        close({saved: saved || undefined});
                    } else {
                        close();
                    }
                };

                return (
                    <UsersForm
                        mode={mode}
                        defaultValues={data}
                        loading={loading}
                        error={error}
                        submitLabel={isCreate ? 'Criar' : isEdit ? 'Salvar' : 'Fechar'}
                        onSubmit={handleSubmit}
                    />
                );
            }}
        </RouteModal>
    )
}