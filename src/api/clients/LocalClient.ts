import type {IHttpClientStrategy} from "@/api/clients/base/HttpClientStrategy.ts";
import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";

export class LocalClient<T = any> implements IHttpClientStrategy<T> {
    constructor() {}

    post(url: string, payload: T, props?: any): Promise<IApiSuccess<T>> {

    }

    update(url: string, id: number | string, payload: Partial<T>, props?: any): Promise<IApiSuccess<T>> {

    }

    delete(url: string, id: number | string, props?: any): Promise<IApiSuccess<T>> {

    }

    getAll(url: string, props?: any): Promise<IApiSuccess<T[]>> {

    }

    get(url: string, id: number | string, props?: any): Promise<IApiSuccess<T>> {

    }

}