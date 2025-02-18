import { InternalData, InternalRequestConfig, InternalResponse } from './config';
export type InterceptorOnRequestFulfilled = ((value: InternalRequestConfig) => InternalRequestConfig | Promise<InternalRequestConfig>) | null;
export type InterceptorOnResponseFulfilled<T = unknown> = ((value: InternalResponse<T>) => InternalResponse<T> | Promise<InternalResponse<T>>) | null;
export type InterceptorRejected = ((error: any) => any) | null;
export declare const internalRequestFulfilledInterceptor: InterceptorOnRequestFulfilled;
export declare const internalResponseFulfilledInterceptor: InterceptorOnResponseFulfilled<InternalData>;
