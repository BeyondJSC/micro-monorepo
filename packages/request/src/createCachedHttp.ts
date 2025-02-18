import { AxiosError } from 'axios'
import { BaseRequest } from './baseRequest'
import { InternalData, RequestConfig } from './config'

/**
 * 生成唯一的缓存键
 * @param {AxiosRequestConfig} config - Axios 请求配置对象
 * @returns {string} - 唯一的缓存键
 */
function generateCacheKey(config: RequestConfig): string {
  let key = config.url || ''
  if (config.params) {
    const sortedParams = Object.entries(config.params).sort((a, b) =>
      a[0].localeCompare(b[0])
    )
    key += '?' + sortedParams.map(([k, v]) => `${k}=${v}`).join('&')
  }
  if (config.data) {
    key += JSON.stringify(config.data)
  }
  return key
}

export function createCachedRequest(
  baseRequestVm: BaseRequest,
  cacheDuration: number = 5 * 1000
) {
  // 用于存储请求的缓存对象
  const requestCache: {
    [key: string]: {
      promise: Promise<InternalData>
      expiry: number
    }
  } = {}

  // 清除过期缓存的函数
  function clearExpiredCache() {
    const now = Date.now()
    for (const key in requestCache) {
      if (
        Object.prototype.hasOwnProperty.call(requestCache, key) &&
        requestCache[key].expiry < now
      ) {
        delete requestCache[key]
      }
    }
  }

  const createRequestProxy = function (
    requestMethod: (config: RequestConfig) => Promise<InternalData<unknown>>
  ) {
    return function (config: RequestConfig) {
      clearExpiredCache()

      const cacheKey = generateCacheKey(config)
      const now = Date.now()
      const cached = requestCache[cacheKey]

      if (cached && cached.expiry > now) {
        return cached.promise
      }

      // 创建一个占位的 Promise
      const newPromise = new Promise<InternalData>((resolve, reject) => {
        requestMethod(config)
          .then((response) => {
            const updatedPromise = Promise.resolve(response)
            requestCache[cacheKey] = {
              promise: updatedPromise,
              expiry: now + cacheDuration
            }
            resolve(response)
          })
          .catch((error: AxiosError) => {
            const updatedPromise = Promise.reject(error)
            requestCache[cacheKey] = {
              promise: updatedPromise,
              expiry: now + cacheDuration
            }
            reject(error)
          })
      })

      if (!cached || cached.expiry <= now) {
        requestCache[cacheKey] = {
          promise: newPromise,
          expiry: now + cacheDuration
        }
      }

      return newPromise
    }
  }

  return {
    http: createRequestProxy(baseRequestVm.http),
    get: createRequestProxy(baseRequestVm.get),
    post: createRequestProxy(baseRequestVm.post)
  }
}
