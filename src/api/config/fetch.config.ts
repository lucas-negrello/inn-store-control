import type {IApiError} from "@/api/interfaces/ApiResponse.interface.ts";
import {environment} from "@/environments/environment.ts";

const baseUrl = environment.baseApi;

const defaultHeadedrs = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return token ? {
        ...defaultHeadedrs, Authorization: `Bearer ${token}`
    } : defaultHeadedrs;
}

async function handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('Content-Type') ?? "";

    if (!response.ok) {
        if (contentType.includes("application/json")) {
            throw {
                success: false,
                message: response.statusText,
                error: await response.json(),
                code: response.status
            } as IApiError;
        } else {
            throw {
                success: false,
                message: response.statusText,
                error: await response.text(),
                code: response.status
            } as IApiError;
        }
    }

    if (contentType.includes("application/json")) {
        return response.json();
    }

    return {} as T;
}

export const fetchConfig = {
    baseUrl,
    getAuthHeaders,
    handleResponse,
}