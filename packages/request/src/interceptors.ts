import { InternalData, InternalRequestConfig, InternalResponse } from './config'

export type InterceptorOnRequestFulfilled =
  | ((
      value: InternalRequestConfig
    ) => InternalRequestConfig | Promise<InternalRequestConfig>)
  | null

export type InterceptorOnResponseFulfilled<T = unknown> =
  | ((
      value: InternalResponse<T>
    ) => InternalResponse<T> | Promise<InternalResponse<T>>)
  | null

export type InterceptorRejected = ((error: any) => any) | null

export const internalRequestFulfilledInterceptor: InterceptorOnRequestFulfilled =
  function (request) {
    // TDDO
    return request
  }

export const internalResponseFulfilledInterceptor: InterceptorOnResponseFulfilled<InternalData> =
  function (response) {
    return response
  }
