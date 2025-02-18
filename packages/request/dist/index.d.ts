import { BaseRequest } from './baseRequest';
import { CreateInternalDefaults } from './config';
import { createCachedRequest } from './createCachedHttp';
export declare function createRequest(createInternalDefaults?: CreateInternalDefaults): BaseRequest;
export { createCachedRequest };
