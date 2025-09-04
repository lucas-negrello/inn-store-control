import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";

export const ResponseAdapter = {
    toResponse<T>(data: T, code?: number, message?: string): IApiSuccess<T> {
        return {
            success: true,
            data,
            message: message ?? 'Sucesso',
            code: code ?? 200,
        }
    },

    fromResponse<T>(response: IApiSuccess<T>): T {
        return response.data;
    }
}