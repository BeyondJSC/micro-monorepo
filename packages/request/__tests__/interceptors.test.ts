import { BaseRequest } from '../src/baseRequest';
import { mockAxiosCreate } from './test-utils/axiosMock';

const interceptors = {
  request: { use: jest.fn(), eject: jest.fn() },
  response: { use: jest.fn(), eject: jest.fn() }
};

mockAxiosCreate({
  interceptors
});

describe('BaseRequest Interceptors', () => {
  test('should register request interceptor', () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const options = { synchronous: true };
    
    const request = new BaseRequest();
    request.addRequestInterceptor(onFulfilled, onRejected, options);
    
    expect(interceptors.request.use).toHaveBeenCalledWith(
      onFulfilled,
      onRejected,
      options
    );
  });

  test('should register response interceptor', () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    
    const request = new BaseRequest();
    request.addResponseInterceptor(onFulfilled, onRejected);
    
    expect(interceptors.response.use).toHaveBeenCalledWith(
      onFulfilled,
      onRejected
    );
  });
});