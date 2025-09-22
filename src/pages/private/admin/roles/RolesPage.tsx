import {useAdminPage} from "@/pages/private/admin/AdminPageHook.tsx";

export const RolesPage = () => {
    const { roles } = useAdminPage();

    console.log(roles);

    return <div>Roles Page</div>;
}