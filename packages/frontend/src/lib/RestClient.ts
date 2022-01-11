import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

type InterceptorOnFulfilled = (value: any) => any;
type InterceptorOnRejected = (error: any) => any;

export const HttpMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export class RestClient {
  private readonly client: AxiosInstance;

  constructor(baseURL = '/', config: AxiosRequestConfig = {}) {
    this.client = axios.create({ ...config, baseURL });
    this.client.interceptors.response.use(({ data }) => data);
  }

  addRequestInterceptor(onFulfilled?: InterceptorOnFulfilled, onRejected?: InterceptorOnRejected) {
    this.client.interceptors.request.use(onFulfilled, onRejected);
  }

  addResponseInterceptor(onFulfilled?: InterceptorOnFulfilled, onRejected?: InterceptorOnRejected) {
    this.client.interceptors.response.use(onFulfilled, onRejected);
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.client.get(url, config);
  }

  post(url: string, body?: any, config?: AxiosRequestConfig) {
    return this.client.post(url, body, config);
  }

  put(url: string, body?: any, config?: AxiosRequestConfig) {
    return this.client.put(url, body, config);
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.client.delete(url, config);
  }

  patch(url: string, body?: any, config?: AxiosRequestConfig) {
    return this.client.patch(url, body, config);
  }
}
