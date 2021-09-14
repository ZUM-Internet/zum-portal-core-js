import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

enum HttpMethod {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export class RestClient {
  private readonly client: AxiosInstance

  constructor(baseURL = "/", config?: AxiosRequestConfig) {
    this.client = axios.create({ ...config, baseURL });
    this.client.interceptors.response.use(({ data }) => data);
  }

  public addRequestInterceptor (
    interceptor: (request: AxiosRequestConfig) => AxiosRequestConfig
  ) {
    this.client.interceptors.request.use(interceptor);
  }

  public addResponseInterceptor (
    interceptor: (response: AxiosRequestConfig) => AxiosRequestConfig
  ) {
    this.client.interceptors.response.use(interceptor);
  }

  public get<Response> (
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Response> {
    return this.client.get(url, config);
  }

  public post<Response, Request> (
    url: string,
    body: Request,
    config?: AxiosRequestConfig
  ) {
    return this.client.post(url, body, config);
  }

  public put<Response, Request> (
    url: string,
    body: Request,
    config?: AxiosRequestConfig
  ) {
    return this.client.put(url, body, config);
  }

  public delete<Response> (
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Response> {
    return this.client.delete(url, config);
  }

  public patch<Response, Request> (
    url: string,
    body: Request,
    config?: AxiosRequestConfig
  ) {
    return this.client.patch(url, body, config);
  }
}
