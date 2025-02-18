import { BaseRequest } from './baseRequest'
import { CreateInternalDefaults } from './config'
import { createCachedRequest } from './createCachedHttp'

export function createRequest(createInternalDefaults?: CreateInternalDefaults) {
  return new BaseRequest(createInternalDefaults)
}

export { createCachedRequest }
