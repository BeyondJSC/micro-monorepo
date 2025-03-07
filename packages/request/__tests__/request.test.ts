import axios from 'axios'
import { BaseRequest, createRequest } from '../src/index'
import { mockAxiosCreate } from './test-utils/axiosMock';
import { message } from 'ant-design-vue';

const mockRequest = jest.fn()

mockAxiosCreate({ 
  requestImpl: mockRequest,
  getImpl: jest.fn(),
  postImpl: jest.fn()
});

// 模拟Ant Design Vue的message.error方法
const mockMessage = jest.fn()
jest.spyOn(message, 'error').mockImplementation(mockMessage)

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Request Library', () => {
  let reqInstance: ReturnType<typeof createRequest>

  beforeEach(() => {
    reqInstance = createRequest({
      silent: true,
      onErrorMessage: jest.fn()
    })
  })

  test('should create axios instance', async () => {
    // 清除之前的模拟调用记录
    mockedAxios.create.mockClear()
  
    const request = createRequest({
      baseURL: 'https://api.example.com'
    })

    // 验证实例创建
    expect(request).toBeInstanceOf(BaseRequest)

    mockRequest.mockResolvedValue({
      data: {
        code: 200,
        message: 'OK',
        data:'response'
      }
    })

    await request.http({ url: '/test' })

    expect(mockedAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://api.example.com'
      })
    )
  })

  test('POST方法正确传递参数和数据', async () => {
    mockRequest.mockResolvedValue({
      status: 200,
      data: { code: 200, message: 'OK', data: 'response' }
    });
  
    const response = await reqInstance.post({
      url: '/api/post',
      data: { key: 'value' },
      params: { page: 1 },
      headers: { 'Content-Type': 'application/json' }
    });
  
    expect(mockRequest).toHaveBeenCalledWith(expect.objectContaining({
      method: 'post',
      data: { key: 'value' },
      params: { page: 1 },
      headers: expect.objectContaining({
        'Content-Type': 'application/json'
      })
    }));
    expect(response.data).toBe('response');
  });

  test('POST方法处理不同HTTP状态码', async () => {
    const testCases = [
      { status: 201, expected: 'Created' },
      { status: 400, expected: 'Bad Request' },
      { status: 401, expected: 'Unauthorized' }
    ];
  
    for (const { status, expected } of testCases) {
      mockRequest.mockResolvedValueOnce({
        status,
        data: { code: status, message: expected }
      });
  
      await expect(reqInstance.post({ url: '/api/status' }))
        .rejects.toMatchObject({ code: status, message: expected });
    }
  });

  test('处理code非200接口内部错误的情况', async () => {
    mockRequest.mockResolvedValue({
      status: 200,
      data: {
        code: 500,
        message: 'Internal Server Error',
        data: null
      }
    })

    // 使用beforeEach已初始化的reqInstance
    await expect(
      reqInstance.http({ url: '/api/server-error', method: 'get' })
    ).rejects.toMatchObject({
      code: 500,
      message: 'Internal Server Error',
      data: null
    })
  })

  test('处理请求取消', async () => {
    const cancelToken = axios.CancelToken.source()
    mockRequest.mockRejectedValue({
      response: {
        data: {
          code: 499,
          message: 'Request canceled',
          data: null
        }
      },
      isCancel: true
    })

    setTimeout(() => cancelToken.cancel(), 100)
    await expect(
      reqInstance.http({
        url: '/api/cancel',
        cancelToken: cancelToken.token
      })
    ).rejects.toHaveProperty('isCancel', true)
  })

  test('上传进度回调应正确触发', async () => {
    const mockProgress = jest.fn();
    
    let capturedConfig: any;
    mockRequest.mockImplementation((config) => {
      capturedConfig = config;
      return Promise.resolve({
        data: {
          code: 200,
          message: 'OK',
          data: 'upload-success'
        }
      });
    });
  
    await reqInstance.upload({
      url: '/api/upload',
      data: new FormData(),
      onUploadProgress: mockProgress
    });
  
    // 模拟axios触发上传进度事件
    const progressEvent = {
      loaded: 50,
      total: 100
    };
    capturedConfig.onUploadProgress(progressEvent);
  
    expect(mockProgress).toHaveBeenCalledWith(50, progressEvent);
  });

  test('全局silent为true时不触发错误处理', async () => {
    const errorHandler = jest.fn();
    const instance = createRequest({
      silent: true,
      onErrorMessage: errorHandler
    });
  
    mockRequest.mockRejectedValueOnce({
      response: { data: { code: 500, message: 'Server Error' } }
    });
  
    await expect(instance.get({ url: '/test' })).rejects.toBeDefined();

    expect(errorHandler).not.toHaveBeenCalled();
  });
  
  test('请求级silent覆盖全局配置', async () => {
    const errorHandler = jest.fn();
    const instance = createRequest({
      silent: true,
      onErrorMessage: errorHandler
    });
  
    mockRequest.mockResolvedValueOnce({ status: 200, data: { code: 400, message: 'Bad Request' }});
  
    await expect(instance.get({
      url: '/test',
      silent: false
    })).rejects.toBeDefined();

    expect(errorHandler).toHaveBeenCalledWith('Bad Request');
  });

  test('请求错误时的默认错误处理', async () => {
    const instance = createRequest({
      silent: true,
    });

    mockRequest.mockResolvedValueOnce({ status: 200, data: { code: 500, message: 'Server Error' }});

    await expect(instance.get({ url: '/test', silent: false })).rejects.toBeDefined();

    expect(mockMessage).toHaveBeenCalledWith('Server Error');
  });
  
  test('多个接口内部错误请求正确调用次数', async () => {
    const errorHandler = jest.fn();
    const instance = createRequest({ onErrorMessage: errorHandler });
  
    mockRequest
      .mockResolvedValueOnce({ status: 200, data: { code: 401, message: 'Unauthorized' }})
      .mockResolvedValueOnce({ status: 200, data: { code: 403, message: 'Forbidden' } });
  
    await Promise.all([
      expect(instance.get({ url: '/test1' })).rejects.toBeDefined(),
      expect(instance.get({ url: '/test2' })).rejects.toBeDefined()
    ]);
  
    expect(errorHandler).toHaveBeenCalledTimes(2);
  });
  
  test('不同错误码和消息的参数传递', async () => {
    const errorHandler = jest.fn();
    const instance = createRequest({ onErrorMessage: errorHandler });
  
    const testCases = [
      { code: 404, message: 'Not Found' },
      { code: 500, message: 'Internal Error' }
    ];
  
    for (const { code, message } of testCases) {
      mockRequest.mockResolvedValueOnce({ status: 200, data: { code, message } });
      // 假设这里调用的是 get 方法，需要确保参数符合类型要求
      await expect(instance.get({ url: '/test' })).rejects.toBeDefined();
      expect(errorHandler).toHaveBeenCalledWith(message);
    }
  });
})
