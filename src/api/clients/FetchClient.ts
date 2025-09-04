import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import type {IHttpClientStrategy} from "@/api/clients/base/HttpClientStrategy.ts";
import {fetchConfig} from "@/api/config/fetch.config.ts";

export class FetchClient<T> implements IHttpClientStrategy<T> {
    async post(url: string, payload: T): Promise<IApiSuccess<T>> {
        const response = await fetch(`${fetchConfig.baseUrl}/${url}`, {
            method: "POST",
            headers: fetchConfig.getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        return fetchConfig.handleResponse<IApiSuccess<T>>(response);
    }

    async getAll(url: string): Promise<IApiSuccess<T[]>> {
        const response = await fetch(`${fetchConfig.baseUrl}/${url}`, {
            method: "GET",
            headers: fetchConfig.getAuthHeaders(),
        });

        return fetchConfig.handleResponse<IApiSuccess<T[]>>(response);
    }

    async get(url: string, id: number | string): Promise<IApiSuccess<T>> {
        const response = await fetch(`${fetchConfig.baseUrl}/${url}/${id}`, {
            method: "GET",
            headers: fetchConfig.getAuthHeaders(),
        });

        return fetchConfig.handleResponse<IApiSuccess<T>>(response);
    }

    async update(url: string, id: number | string, payload: Partial<T>): Promise<IApiSuccess<T>> {
        const response = await fetch(`${fetchConfig.baseUrl}/${url}/${id}`, {
            method: "PUT",
            headers: fetchConfig.getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        return fetchConfig.handleResponse<IApiSuccess<T>>(response);
    }

    async delete(url: string, id: number | string): Promise<IApiSuccess<T>> {
        const response = await fetch(`${fetchConfig.baseUrl}/${url}/${id}`, {
            method: "DELETE",
            headers: fetchConfig.getAuthHeaders(),
        });

        return fetchConfig.handleResponse<IApiSuccess<T>>(response);
    }

}