import type {IUser} from "@/api/models/Users.interface.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import type {BaseIdType, UserEntity} from "@/infrastructure/localDb/entities.ts";
import {UserAdapter} from "@/infrastructure/localDb/adapters/UserAdapter.ts";
import {db} from "@/infrastructure/localDb/db.ts";
import {ResponseAdapter} from "@/infrastructure/localDb/adapters/ResponseAdapter.ts";
import {nowIso} from "@/infrastructure/localDb/utils/generalUtils.ts";
import {UserRelationshipsService} from "@/infrastructure/localDb/services/Relationships/UserRelationshipsService.ts";



export class UsersService
    extends UserRelationshipsService {
    async create(data: IUser, passwordHash?: string): Promise<IApiSuccess<IUser>> {
        try {
            const entity = UserAdapter.toEntity(data, passwordHash);

            const id = await db.users.add(entity);
            const created = await db.users.get(id);

            const domain = UserAdapter.toDomain(created!);

            return ResponseAdapter.toResponse(domain, 201);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async update(id: BaseIdType, data: Partial<IUser>): Promise<IApiSuccess<IUser>> {
        try {
            const current: UserEntity | undefined = await db.users.get(id);
            if (!current) throw new Error('User not found');

            const user: IUser = UserAdapter.toDomain(current);
            const mergedUser: IUser = {...user, ...data};
            const entity: UserEntity = UserAdapter.toEntity(mergedUser);
            const merged: UserEntity = {...current, ...entity, updated_at: nowIso()};

            await db.users.put(merged);

            const updated = await db.users.get(id);
            const domain = UserAdapter.toDomain(updated!);

            return ResponseAdapter.toResponse(domain);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async delete(id: BaseIdType, softDelete?: boolean): Promise<IApiSuccess<null>> {
        try {
            if (!softDelete) await Promise.all([
                db.users.delete(id),
                db.user_roles.where('user_id').equals(id).delete(),
                db.user_permissions.where('user_id').equals(id).delete(),
                db.user_menus.where('user_id').equals(id).delete(),
            ]);
            else {
                const user = await db.users.get(id);
                if (!user) throw new Error('User not found');

                await db.users.put({...user!, deleted_at: nowIso()});
            }

            return ResponseAdapter.toResponse(null, 204, 'User deleted');
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    async findById(id: BaseIdType): Promise<IApiSuccess<IUser>> {
        try {
            const entity = await db.users.get(id);
            if (!entity) throw new Error('User not found');

            const domain = UserAdapter.toDomain(entity);
            return ResponseAdapter.toResponse(domain);
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    async findByEmail(email: string): Promise<IApiSuccess<IUser>> {
        try {
            const entity = await db.users.where('email').equals(email).first();
            if (!entity) throw new Error('User not found');

            const domain = UserAdapter.toDomain(entity);
            return ResponseAdapter.toResponse(domain);
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    async list(): Promise<IApiSuccess<IUser[]>> {
        try {
            const entities: UserEntity[] = await db.users.toArray();
            const domains: IUser[] = entities.map(UserAdapter.toDomain);
            return ResponseAdapter.toResponse(domains);
        } catch (error) {
            console.error('Error listing users', error);
            throw error;
        }
    }
}