import {db} from "@/infrastructure/localDb/db.ts";

export async function seedLocalDbFromMocks() {
    const userCount = await db.users.count();

    if (userCount > 0) return;

    const tables = [
        db.users,
        db.roles,
        db.permissions,
        db.menus,
        db.user_roles,
        db.role_permissions,
        db.user_permissions,
        db.user_menus
    ]

    await db.transaction('rw', tables, async () => {
        
    });
}