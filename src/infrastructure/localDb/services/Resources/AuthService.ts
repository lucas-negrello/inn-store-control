import type {
    ILoginCredentials,
    ILoginResponse,
    ILogoutResponse, IRegisterCredentials,
    IRegisterResponse
} from "@/api/models/Auth.interface.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import type {IUser} from "@/api/models/Users.interface.ts";

export class AuthService {
    public login = (credentials: ILoginCredentials): IApiSuccess<ILoginResponse> => {
        throw 'Method not implemented';
    }

    public register = (credentials: IRegisterCredentials): IApiSuccess<IRegisterResponse> => {
        throw 'Method not implemented';
    }

    public logout = (credentials: any): IApiSuccess<ILogoutResponse> => {
        throw 'Method not implemented';
    }

    public me = (): IApiSuccess<IUser> => {
        throw 'Method not implemented';
    }
}