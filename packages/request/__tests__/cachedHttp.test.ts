import { createRequest, createCachedRequest } from '../src/index';
import { generateCacheKey } from '../src/createCachedHttp';
import { mockAxiosCreate } from './test-utils/axiosMock';
import { RequestConfig } from '../src/config';
import { AxiosError } from 'axios';

// 替换原有的 jest.spyOn 代码块
const mockRequest = jest.fn();

mockAxiosCreate({ 
  requestImpl: mockRequest,
  getImpl: jest.fn(),
  postImpl: jest.fn()
});

describe('Cached Request 功能测试', () => {
  const baseRequest = createRequest();
  const cachedRequest = createCachedRequest(baseRequest, 5000);

  beforeEach(() => {
    jest.useFakeTimers();
    mockRequest.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('并发请求应共享缓存', async () => {
    mockRequest.mockResolvedValueOnce({
      data: { code: 200, message: 'OK', data: 'concurrent' }
    });

    const [res1, res2] = await Promise.all([
      cachedRequest.http({ url: '/api/concurrent' }),
      cachedRequest.http({ url: '/api/concurrent' })
    ]);

    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(res1).toBe(res2);
  });

  test('缓存过期后应重新请求', async () => {
    mockRequest.mockResolvedValue({
      data: { code: 200, message: 'OK', data: 'response' }
    });

    jest.advanceTimersByTime(6000);
    await cachedRequest.http({ url: '/api/cached', method: 'get' });
    jest.advanceTimersByTime(6000);
    await cachedRequest.http({ url: '/api/cached', method: 'get' });

    expect(mockRequest).toHaveBeenCalledTimes(2);
  });

  test('不同参数请求不应共享缓存', async () => {
    mockRequest.mockResolvedValue({
      data: { code: 200, message: 'OK', data: 'response' }
    });

    await cachedRequest.http({ url: '/api/cached', params: { page: 1 } });
    await cachedRequest.http({ 
      url: '/api/cached',
      method: 'get',
      params: { page: 2 }
    });

    expect(mockRequest).toHaveBeenCalledTimes(2);
  });
});

describe('错误请求缓存处理', () => {
  const baseRequest = createRequest();
  const cachedRequest = createCachedRequest(baseRequest, 5000);
  
  beforeEach(() => {
    jest.useFakeTimers();
    mockRequest.mockClear();
  });

  test('应缓存业务错误请求', async () => {
    const errorResponse = { response: { data: { code: 400, message: '业务错误' }}};
    mockRequest.mockRejectedValueOnce(errorResponse);

    await expect(cachedRequest.get({ url: '/error' })).rejects.toEqual(errorResponse);

    // 验证缓存生效
    mockRequest.mockClear();
    await expect(cachedRequest.get({ url: '/error' })).rejects.toEqual(errorResponse);
    expect(mockRequest).not.toHaveBeenCalled();
  });

  test('应缓存网络错误请求', async () => {
    const networkError = new Error('Network Error') as AxiosError;
    mockRequest.mockRejectedValueOnce(networkError);

    await expect(cachedRequest.get({ url: '/network-error' })).rejects.toThrow('Network Error');

    // 验证缓存生效
    mockRequest.mockClear();
    await expect(cachedRequest.get({ url: '/network-error' })).rejects.toThrow('Network Error');
    expect(mockRequest).not.toHaveBeenCalled();
  });

  test('错误缓存应在过期后清除', async () => {
    const errorResponse = { response: { data: { code: 500, message: '服务端错误' }}};
    mockRequest.mockRejectedValue(errorResponse);

    await expect(cachedRequest.get({ url: '/server-error' })).rejects.toEqual(errorResponse);
    
    // 过期后重新请求
    jest.advanceTimersByTime(6000);
    await expect(cachedRequest.get({ url: '/server-error' })).rejects.toEqual(errorResponse);
    expect(mockRequest).toHaveBeenCalledTimes(2);
  });
});

describe('generateCacheKey 参数排序和序列化测试', () => {
  test('参数顺序不影响缓存键', () => {
    const config1 = { url: '/api', params: { a: 1, b: 2 } };
    const config2 = { url: '/api', params: { b: 2, a: 1 } };
    
    expect(generateCacheKey(config1 as RequestConfig))
      .toBe(generateCacheKey(config2 as RequestConfig));
  });

  test('处理不同数据结构', () => {
    const testCases = [
      { data: { x: 1, y: 2 } },
      { data: [1, 2, 3] },
      { data: new Date('2023-01-01').toString() },
      { data: { nested: { a: [1,2], b: { c: 3 } } } },
    ];

    testCases.forEach((config, index, arr) => {
      const key = generateCacheKey(config as RequestConfig);
      // 验证序列化后的JSON可以正确解析
      expect(JSON.parse(key)).toEqual(config.data);
      // 确保每个用例生成不同的缓存键
      arr.slice(0, index).forEach(prevConfig => {
        expect(key).not.toBe(generateCacheKey(prevConfig as RequestConfig));
      });
    });
  });
});