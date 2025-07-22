export interface IApiSuccess<T> {
    success: boolean;
    data: T;
    message: string;
    code: number;
}

export interface IApiError {
    success: boolean;
    error: unknown;
    message: string;
    code: number;
}

export interface IBaseModel {
    id?: number | string;
    created_at?: string;
    updated_at?: string;
}