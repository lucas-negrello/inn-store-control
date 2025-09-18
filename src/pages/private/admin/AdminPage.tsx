import {useAdminPage} from "@/pages/private/admin/AdminPageHook.tsx";

export default function AdminPage() {
    const { users, roles, permissions } = useAdminPage();

    console.log({ users, roles, permissions });
    return (<h1>Admin</h1>);
}