import {HttpFacade} from "@/api/facades/base/HttpFacade.ts";
import type {TClient} from "@/api/interfaces/Client.interface.ts";
import {environment} from "@/environments/environment.ts";
import type {IHttpFacadeOptions} from "@/api/interfaces/HttpFacade.interface.ts";
import type {ILoginCredentials, ILoginResponse} from "@/api/models/Auth.interface.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import type {IUser} from "@/api/models/Users.interface.ts";
import type {LocalClientStrategy} from "@/api/clients/base/LocalClientStrategy.ts";

export class AuthFacade extends HttpFacade<unknown> {
    constructor(
        url: string,
        clientType: TClient = environment.defaultStrategy,
        options?: IHttpFacadeOptions,
        localClientStrategy?: LocalClientStrategy<unknown>
    ) {
        super(url, clientType, options, localClientStrategy);
    }

    login =
        (credentials: ILoginCredentials) =>
            (this._client.post(`${this._url}/login`, credentials) as Promise<IApiSuccess<ILoginResponse>>).then(
                (response: IApiSuccess<ILoginResponse>) =>
                {
                    if (!response.success) return response;
                    this.getStorage()?.set('auth_token', response.data.token, response.data.ttl);
                    return response;
                });

    logout = () =>
        (this._client.post(`${this._url}/logout`, {}) as Promise<IApiSuccess<null>>).then(
            (response: IApiSuccess<null>) => {
                if (!response.success) return response;
                this.getStorage()?.remove('auth_token');
                return response;
            });

    me = () =>
        this._client.get(`${this._url}`, 'me') as Promise<IApiSuccess<IUser>>;

}