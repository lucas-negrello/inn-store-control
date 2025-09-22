import {useAdminPage} from "@/pages/private/admin/AdminPageHook.tsx";

export const PermissionsPage = () => {
    const { permissions } = useAdminPage();

    console.log(permissions);

    return <div>Permissions Page</div>;
}