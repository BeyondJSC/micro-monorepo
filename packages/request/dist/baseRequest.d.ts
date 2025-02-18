import { AxiosInterceptorOptions } from 'axios';
import { CreateInternalDefaults, InternalData, RequestConfig } from './config';
import { InterceptorOnRequestFulfilled, InterceptorRejected, InterceptorOnResponseFulfilled } from './interceptors';
export declare class BaseRequest {
    private requestInstance;
    private globalConfig;
    constructor(config?: CreateInternalDefaults);
    addRequestInterceptor(onFulfilled?: InterceptorOnRequestFulfilled, onRejected?: InterceptorRejected, options?: AxiosInterceptorOptions): void;
    addResponseInterceptor(onFulfilled?: InterceptorOnResponseFulfilled, onRejected?: InterceptorRejected): void;
    http<D = any>(config: RequestConfig<D>): Promise<InternalData<unknown>>;
    post<D = any>(config: Omit<RequestConfig<D>, 'method'>): Promise<InternalData<unknown>>;
    get<D = any>(config: Omit<RequestConfig<D>, 'method'>): Promise<InternalData<unknown>>;
    upload(): void;
    download(): void;
}
