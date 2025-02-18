import axios from 'axios';
import { message } from 'ant-design-vue';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var createRequestDefaults = {
  timeout: 60000,
  baseURL: '/',
  onErrorMessage: function onErrorMessage(msg) {
    message.error(msg);
  }
};

var BaseRequest = /** @class */function () {
  function BaseRequest(config) {
    this.globalConfig = __assign(__assign({}, config), createRequestDefaults);
    this.requestInstance = axios.create(this.globalConfig);
  }
  BaseRequest.prototype.addRequestInterceptor = function (onFulfilled, onRejected, options) {
    this.requestInstance.interceptors.request.use(onFulfilled, onRejected, options);
  };
  BaseRequest.prototype.addResponseInterceptor = function (onFulfilled, onRejected) {
    this.requestInstance.interceptors.response.use(onFulfilled, onRejected);
  };
  BaseRequest.prototype.http = function (config) {
    var _this = this;
    return this.requestInstance(config).then(function (response) {
      var resData = response.data;
      if (resData.code !== 200) {
        if (!_this.globalConfig.silent && !config.silent) {
          _this.globalConfig.onErrorMessage && _this.globalConfig.onErrorMessage(resData.message);
        }
        return Promise.reject(resData);
      }
      return resData;
    });
  };
  BaseRequest.prototype.post = function (config) {
    return this.http(__assign(__assign({}, config), {
      method: 'post'
    }));
  };
  BaseRequest.prototype.get = function (config) {
    return this.http(__assign(__assign({}, config), {
      method: 'get'
    }));
  };
  BaseRequest.prototype.upload = function () {
    // TODO
  };
  BaseRequest.prototype.download = function () {
    // TODO
  };
  return BaseRequest;
}();

/**
 * 生成唯一的缓存键
 * @param {AxiosRequestConfig} config - Axios 请求配置对象
 * @returns {string} - 唯一的缓存键
 */
function generateCacheKey(config) {
  var key = config.url || '';
  if (config.params) {
    var sortedParams = Object.entries(config.params).sort(function (a, b) {
      return a[0].localeCompare(b[0]);
    });
    key += '?' + sortedParams.map(function (_a) {
      var k = _a[0],
        v = _a[1];
      return "".concat(k, "=").concat(v);
    }).join('&');
  }
  if (config.data) {
    key += JSON.stringify(config.data);
  }
  return key;
}
function createCachedRequest(baseRequestVm, cacheDuration) {
  if (cacheDuration === void 0) {
    cacheDuration = 5 * 1000;
  }
  // 用于存储请求的缓存对象
  var requestCache = {};
  // 清除过期缓存的函数
  function clearExpiredCache() {
    var now = Date.now();
    for (var key in requestCache) {
      if (Object.prototype.hasOwnProperty.call(requestCache, key) && requestCache[key].expiry < now) {
        delete requestCache[key];
      }
    }
  }
  var createRequestProxy = function createRequestProxy(requestMethod) {
    return function (config) {
      clearExpiredCache();
      var cacheKey = generateCacheKey(config);
      var now = Date.now();
      var cached = requestCache[cacheKey];
      if (cached && cached.expiry > now) {
        return cached.promise;
      }
      // 创建一个占位的 Promise
      var newPromise = new Promise(function (resolve, reject) {
        requestMethod(config).then(function (response) {
          var updatedPromise = Promise.resolve(response);
          requestCache[cacheKey] = {
            promise: updatedPromise,
            expiry: now + cacheDuration
          };
          resolve(response);
        }).catch(function (error) {
          var updatedPromise = Promise.reject(error);
          requestCache[cacheKey] = {
            promise: updatedPromise,
            expiry: now + cacheDuration
          };
          reject(error);
        });
      });
      if (!cached || cached.expiry <= now) {
        requestCache[cacheKey] = {
          promise: newPromise,
          expiry: now + cacheDuration
        };
      }
      return newPromise;
    };
  };
  return {
    http: createRequestProxy(baseRequestVm.http),
    get: createRequestProxy(baseRequestVm.get),
    post: createRequestProxy(baseRequestVm.post)
  };
}

function createRequest(createInternalDefaults) {
  return new BaseRequest(createInternalDefaults);
}

export { createCachedRequest, createRequest };
