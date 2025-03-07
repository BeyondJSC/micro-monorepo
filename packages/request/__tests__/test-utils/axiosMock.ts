import axios from 'axios';

type MockAxiosConfig = {
  requestImpl?: jest.Mock;
  getImpl?: jest.Mock;
  postImpl?: jest.Mock;
  interceptors?: {
    request?: { use: jest.Mock; eject: jest.Mock };
    response?: { use: jest.Mock; eject: jest.Mock };
  };
};

export function mockAxiosCreate(config?: MockAxiosConfig) {
  return jest.spyOn(axios, 'create').mockImplementation(() => ({
    request: config?.requestImpl || jest.fn(),
    get: config?.getImpl || jest.fn(),
    post: config?.postImpl || jest.fn(),
    interceptors: config?.interceptors || {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    },
    defaults: {},
    getUri: jest.fn(),
    cancelToken: { source: jest.fn() }
  } as unknown as jest.Mocked<typeof axios>));
}