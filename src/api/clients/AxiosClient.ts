import type {IHttpClientStrategy} from "@/api/clients/base/HttpClientStrategy.ts";
import type {IApiSuccess, IBaseModel} from "@/api/interfaces/ApiResponse.interface.ts";
import axiosInstance from "@/api/config/axios.config.ts";

export class AxiosClient<T extends IBaseModel> implements IHttpClientStrategy<T> {
    async post(url: string, payload: T): Promise<IApiSuccess<T>> {
        const response = await axiosInstance.post<IApiSuccess<T>>(url, payload);
        return response.data;
    }
    async getAll(url: string): Promise<IApiSuccess<T[]>> {
        const response = await axiosInstance.get<IApiSuccess<T[]>>(url);
        return response.data;
    }
    async get(url: string, id: number | string): Promise<IApiSuccess<T>> {
        const response = await axiosInstance.get<IApiSuccess<T>>(`${url}/${id}`);
        return response.data;
    }
    async update(url: string, id: number | string, payload: T): Promise<IApiSuccess<T>> {
        const response = await axiosInstance.put<IApiSuccess<T>>(`${url}/${id}`, payload);
        return response.data;
    }
    async delete(url: string, id: number | string): Promise<IApiSuccess<T>> {
        const response = await axiosInstance.delete<IApiSuccess<T>>(`${url}/${id}`);
        return response.data;
    }

}