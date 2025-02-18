import { BaseRequest } from './baseRequest';
import { InternalData, RequestConfig } from './config';
export declare function createCachedRequest(baseRequestVm: BaseRequest, cacheDuration?: number): {
    http: (config: RequestConfig) => Promise<InternalData<unknown>>;
    get: (config: RequestConfig) => Promise<InternalData<unknown>>;
    post: (config: RequestConfig) => Promise<InternalData<unknown>>;
};
