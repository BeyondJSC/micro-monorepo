import { message } from 'ant-design-vue'
import {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig
} from 'axios'

export interface InternalData<T = unknown> {
  code: number
  message: string
  data: T
}

export interface InternalRequestConfig<D = any>
  extends InternalAxiosRequestConfig<D> {
  silent?: boolean
}

export interface RequestConfig<D = any> extends AxiosRequestConfig<D> {
  silent?: boolean
}

export interface InternalResponse<T = any, D = any>
  extends AxiosResponse<T, D> {
  config: InternalRequestConfig<D>
}

export interface CreateInternalDefaults extends CreateAxiosDefaults {
  silent?: boolean
  onErrorMessage?: (message: string) => void
}

export const createRequestDefaults: CreateInternalDefaults = {
  timeout: 60000,
  baseURL: '/',
  onErrorMessage: (msg) => {
    message.error(msg)
  }
}
