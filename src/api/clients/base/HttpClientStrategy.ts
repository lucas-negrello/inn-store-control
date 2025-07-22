import type {IApiSuccess, IBaseModel} from "@/api/interfaces/ApiResponse.interface.ts";

export interface IHttpClientStrategy<T extends IBaseModel> {
    getAll(url: string): Promise<IApiSuccess<T[]>>;
    get(url: string, id: number | string): Promise<IApiSuccess<T>>;
    post(url: string, payload: T): Promise<IApiSuccess<T>>;
    update(url: string, id: number | string, payload: T): Promise<IApiSuccess<T>>;
    delete(url: string, id: number | string): Promise<IApiSuccess<T>>;
}