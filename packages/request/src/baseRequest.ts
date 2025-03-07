import axios, { AxiosInstance, AxiosInterceptorOptions } from 'axios'
import {
  CreateInternalDefaults,
  createRequestDefaults,
  InternalData,
  InternalResponse,
  RequestConfig,
  UploadRequestConfig
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
      ...createRequestDefaults,
      ...config
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

  http<D = any, P = any>(config: RequestConfig<P>) {
    return this.requestInstance.request<
      InternalData<D>,
      InternalResponse<InternalData<D>>,
      P
    >(config).then((response) => {
      const { data: resData } = response
      if (resData.code !== 200) {

        if (!this.globalConfig.silent || !config.silent) {
          this.globalConfig.onErrorMessage &&
            this.globalConfig.onErrorMessage(resData.message)
        }

        return Promise.reject(resData)
      }

      return resData
    })
  }

  post<D = any, P = any>(config: Omit<RequestConfig<P>, 'method'>) {
    return this.http<D, P>({
      ...config,
      method: 'post'
    })
  }

  get<D = any, P = any>(config: Omit<RequestConfig<P>, 'method'>) {
    return this.http<D>({
      ...config,
      method: 'get'
    })
  }

  upload<D = any, P = any>(config: Omit<UploadRequestConfig<P>, 'method'>) {
    return this.http<D, P>({
      ...config,
      method: 'post',
      onUploadProgress: (event) => {
        if (!event.total || !config.onUploadProgress) return
        // 计算上传进度百分比
        const percentCompleted = Math.round((event.loaded * 100) / event.total)

        config.onUploadProgress(percentCompleted, event)
      }
    })
  }

  download() {
    // TODO
  }
}
