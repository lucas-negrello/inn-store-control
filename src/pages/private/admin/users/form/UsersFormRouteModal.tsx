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
    }
    const onClose = (result?: (void | { saved?: IUser })) => {
        console.log(result);
    }

    const onAfterClose = (result?: (void | { saved?: IUser })) => {
        console.log(result);
    }

    return (
        <RouteModal<IUser | undefined, { saved?: IUser } | void>
            title="Usuário"
            openWhen={['create', 'edit']}
            onOpenData={onOpenData}
            onClose={onClose}
            onAfterClose={onAfterClose}
        >
            {({ mode, id, data, loading, error, close}) => {
                const isCreate = mode === 'create';
                const handleSubmit = async (values: IUser) => {
                    if (isCreate) {
                        const saved = await createUser(values);
                        close({ saved: saved || undefined });
                    } else if (id) {
                        const saved = await updateUser(id, values);
                        close({ saved: saved || undefined });
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
                        submitLabel={isCreate ? 'Criar' : 'Salvar'}
                        onSubmit={handleSubmit}
                    />
                );
            }}
        </RouteModal>
    )
}