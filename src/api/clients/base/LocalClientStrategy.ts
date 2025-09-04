import type {IApiSuccess} from "@/api/interfaces/ApiResponse.interface.ts";
import type {BaseIdType} from "@/infrastructure/localDb/entities.ts";

export interface LocalClientStrategy<T = any, FilterTypes = any> {
    create(data: T, props?: any): Promise<IApiSuccess<T>>;
    update(id: BaseIdType, data: Partial<T>, props?: any): Promise<IApiSuccess<T>>;
    delete(id: BaseIdType, props?: any): Promise<IApiSuccess<null>>;
    list(filters?: Partial<FilterTypes>, props?: any): Promise<IApiSuccess<T[]>>;
    findById(id: BaseIdType, props?: any): Promise<IApiSuccess<T>>;
}