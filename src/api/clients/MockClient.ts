import type {IHttpClientStrategy} from "@/api/clients/base/HttpClientStrategy.ts";
import type {IApiSuccess, IBaseModel} from "@/api/interfaces/ApiResponse.interface.ts";

export class MockClient<T extends IBaseModel> implements IHttpClientStrategy<T> {
    async post(url: string, payload: T): Promise<IApiSuccess<T>> {
        return {
            success: true,
            data: payload,
            message: "Mock POST request successful",
            code: 201
        }
    }

    async getAll(url: string): Promise<IApiSuccess<T[]>> {
        const response = await import(`@/assets/mock/${url}.json`);
        return {
            success: true,
            data: response.default as T[],
            message: "Mock GET ALL request successful",
            code: 200
        } as IApiSuccess<T[]>;
    }

    async get(url: string, id: number | string): Promise<IApiSuccess<T>> {
        const response = await import(`@/assets/mock/${url}.json`);
        const data = response.default.find((item: T) => item.id === id);
        return {
            success: !!data,
            data: data ?? ({} as T),
            message: data ? 'Mock GET request successful' : 'Item not found',
            code: data ? 200 : 404
        }
    }

    async update(url: string, id: number | string, payload: T): Promise<IApiSuccess<T>> {
        return {
            success: true,
            data: payload,
            message: "Mock UPDATE request successful",
            code: 200
        }
    }

    async delete(url: string, id: number | string): Promise<IApiSuccess<T>> {
        return {
            success: true,
            data: {} as T,
            message: "Mock DELETE request successful",
            code: 200
        }
    }

}