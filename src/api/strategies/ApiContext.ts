import type {IHttpClientStrategy} from "@/api/clients/base/HttpClientStrategy.ts";
import type {TClient} from "@/api/interfaces/Client.interface.ts";
import {AxiosClient} from "@/api/clients/AxiosClient.ts";
import {FetchClient} from "@/api/clients/FetchClient.ts";
import {LocalClient} from "@/api/clients/LocalClient.ts";

export class ApiContext<T> {
    private _strategy: IHttpClientStrategy<T>;

    constructor(clientType: TClient) {
        switch (clientType) {
            case "axios":
                this._strategy = new AxiosClient<T>();
                break;
            case "fetch":
                this._strategy = new FetchClient<T>();
                break;
            case "local":
                this._strategy = new LocalClient<T>()
                break;
            default:
                this._strategy = new LocalClient<T>();
                break;
        }
    }

    get client(): IHttpClientStrategy<T> {
        return this._strategy;
    }

    set client(strategy: IHttpClientStrategy<T>) {
        this._strategy = strategy;
    }
}