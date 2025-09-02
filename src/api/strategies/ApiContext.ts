import type {IHttpClientStrategy} from "@/api/clients/base/HttpClientStrategy.ts";
import type {TClient} from "@/api/interfaces/Client.interface.ts";
import {AxiosClient} from "@/api/clients/AxiosClient.ts";
import {FetchClient} from "@/api/clients/FetchClient.ts";
import {MockClient} from "@/api/clients/MockClient.ts";

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
            case "mock":
                this._strategy = new MockClient<T>();
                break;
            default:
                this._strategy = new MockClient<T>();
        }
    }

    get client(): IHttpClientStrategy<T> {
        return this._strategy;
    }

    set client(strategy: IHttpClientStrategy<T>) {
        this._strategy = strategy;
    }
}