import {
    ACCESS_TTL_MINUTES,
    type ILoginCredentials,
    type ILoginResponse,
    type ILogoutResponse,
    type IRefreshTokenResponse,
    type IRegisterCredentials,
    type IRegisterResponse,
    REFRESH_TTL_DAYS
} from "@/api/models/Auth.interface.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import type {IUser} from "@/api/models/Users.interface.ts";
import type {AuthTokenEntity, BaseIdType} from "@/infrastructure/localDb/entities.ts";
import {db} from "@/infrastructure/localDb/db.ts";
import {hashPassword, verifyPassword} from "@/infrastructure/localDb/utils/auth/passwordUtils.ts";
import {addDays, addMinutes, nowIso} from "@/infrastructure/localDb/utils/generalUtils.ts";
import {generateToken} from "@/infrastructure/localDb/utils/auth/tokenUtils.ts";
import {UserAdapter} from "@/infrastructure/localDb/adapters/UserAdapter.ts";
import {localStorageService, sessionStorageService} from "@/utils/storage/services/StorageService.ts";

export class AuthService {

    public static setUserPassword = async (userId: BaseIdType, plain: string) => {
        const user = await db.users.get(userId);
        if (!user) throw new Error("User not found");
        const hash = await hashPassword(plain);
        await db.users.update(userId, {password_hash: hash, updated_at: nowIso()})
    }

    public static login = async (credentials: ILoginCredentials): Promise<ILoginResponse> => {
        const user = await db.users.where('email').equals(credentials.email).first();
        if (!user) throw new Error("User not found");
        if (!user.password_hash) {
            const h = await hashPassword(credentials.password);
            await db.users.update(user.id!, { password_hash: h, updated_at: nowIso() });
            user.password_hash = h;
        }

        const ok = await verifyPassword(credentials.password, user.password_hash);
        if (!ok) throw new Error("Invalid credentials");

        await db.auth_tokens.where('user_id').equals(user.id!).and(t => !t.revoked_at).modify(t => {
            t.revoked_at = nowIso();
        });

        const token = generateToken(40);
        const refresh_token = generateToken(48);

        const expires_at = addMinutes(ACCESS_TTL_MINUTES);
        const refresh_expires_at = addDays(REFRESH_TTL_DAYS);

        const tokenEntity: AuthTokenEntity = {
            user_id: user.id!,
            token,
            refresh_token,
            expires_at,
            refresh_expires_at,
            created_at: nowIso(),
            last_used_at: nowIso(),
            revoked_at: null
        };

        await db.auth_tokens.add(tokenEntity);

        return {
            token,
            refresh_token,
            ttl: ACCESS_TTL_MINUTES * 60,
            user: UserAdapter.toDomain(user)
        };

    }

    public static register = async (credentials: IRegisterCredentials): Promise<IRegisterResponse> => {
        throw 'Method not implemented';
    }

    public static logout = async (accessToken: string): Promise<ILogoutResponse> => {
        const tokenRow = await db.auth_tokens.where('token').equals(accessToken).first();
        if (!tokenRow) return null;
        if (!tokenRow.revoked_at) await db.auth_tokens.update(tokenRow.id!, {revoked_at: nowIso()});
        return null;
    }

    public static me = async (): Promise<IUser | null> => {
        const accessToken =
            localStorageService.get('auth_token') as string | null ||
            sessionStorageService.get('auth_token') as string | null;
        if (!accessToken) return null;
        const tokenRow = await db.auth_tokens.where('token').equals(accessToken).first();
        if (!tokenRow) return null;
        if (tokenRow.revoked_at) return null;
        if (new Date(tokenRow.expires_at) < new Date()) return null;

        await db.auth_tokens.update(tokenRow.id!, { last_used_at: nowIso() });

        const savedUser =
            localStorageService.get('user') as IUser | null ||
            sessionStorageService.get('user') as IUser | null;

        if (savedUser) {
            return UserAdapter.toUserSafe(savedUser);
        }
        const user = await db.users.get(tokenRow.user_id);
        if (!user) return null;

        return UserAdapter.toUserSafe(user);
    }

    public static refresh = async (oldRefreshToken: string): Promise<IRefreshTokenResponse | null> => {
        const row = await db.auth_tokens.where('refresh_token').equals(oldRefreshToken).first();
        if (!row) return null;
        if (row.revoked_at) return null;
        if (row.refresh_expires_at && new Date(row.refresh_expires_at) < new Date())
            return null;

        const newToken = generateToken(40);
        const newExpires = addMinutes(ACCESS_TTL_MINUTES);

        await db.auth_tokens.update(row.id!, {
            token: newToken,
            expires_at: newExpires,
            last_used_at: nowIso()
        });

        return {
            token: newToken,
            ttl: ACCESS_TTL_MINUTES * 60
        };
    }
}