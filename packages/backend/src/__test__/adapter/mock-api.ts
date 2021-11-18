import { AxiosRequestConfig } from '@nestjs/common/node_modules/axios';

export const API_URL = 'https://test.zum.com';
export const API_VERSION = '1.0';

const validateRequest = (url: string, headers: Record<string, string>) =>
  url === 'https://test.zum.com' && headers.Accept === 'application/vnd.zum.resource-1.0+json';

export const mockAPI = (url: string, { headers, params, data }: AxiosRequestConfig) => {
  if (!validateRequest(url, headers)) return Promise.reject({ status: 404 });

  return Promise.resolve({
    status: 200,
    data: {
      message: 'success',
      params,
      headers,
      data,
    },
  });
};
