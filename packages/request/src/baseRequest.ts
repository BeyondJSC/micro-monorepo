import axios, { AxiosInstance, AxiosInterceptorOptions } from 'axios'
import {
  CreateInternalDefaults,
  createRequestDefaults,
  InternalData,
  InternalResponse,
  RequestConfig
} from './config'
import {
  InterceptorOnRequestFulfilled,
  InterceptorRejected,
  InterceptorOnResponseFulfilled
} from './interceptors'

export class BaseRequest {
  private requestInstance: AxiosInstance
  private globalConfig: CreateInternalDefaults
  constructor(config?: CreateInternalDefaults) {
    this.globalConfig = {
      ...config,
      ...createRequestDefaults
    }
    this.requestInstance = axios.create(this.globalConfig)
  }

  addRequestInterceptor(
    onFulfilled?: InterceptorOnRequestFulfilled,
    onRejected?: InterceptorRejected,
    options?: AxiosInterceptorOptions
  ) {
    this.requestInstance.interceptors.request.use(
      onFulfilled,
      onRejected,
      options
    )
  }

  addResponseInterceptor(
    onFulfilled?: InterceptorOnResponseFulfilled,
    onRejected?: InterceptorRejected
  ) {
    this.requestInstance.interceptors.response.use(onFulfilled, onRejected)
  }

  http<D = any>(config: RequestConfig<D>) {
    return this.requestInstance<
      InternalData,
      InternalResponse<InternalData>,
      D
    >(config).then((response) => {
      const { data: resData } = response

      if (resData.code !== 200) {
        if (!this.globalConfig.silent && !config.silent) {
          this.globalConfig.onErrorMessage &&
            this.globalConfig.onErrorMessage(resData.message)
        }

        return Promise.reject(resData)
      }

      return resData
    })
  }

  post<D = any>(config: Omit<RequestConfig<D>, 'method'>) {
    return this.http({
      ...config,
      method: 'post'
    })
  }

  get<D = any>(config: Omit<RequestConfig<D>, 'method'>) {
    return this.http({
      ...config,
      method: 'get'
    })
  }

  upload() {
    // TODO
  }

  download() {
    // TODO
  }
}
