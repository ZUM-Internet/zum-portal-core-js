import axios from "axios";

export const HttpMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
}

export class RestClient {
  client;

  constructor (baseURL = "/", config) {
    this.client = axios.create({...config, baseURL});
    this.client.interceptors.response.use(({data}) => data);
  }

  addRequestInterceptor (interceptor) {
    this.client.interceptors.request.use(interceptor);
  }

  addResponseInterceptor (interceptor) {
    this.client.interceptors.response.use(interceptor);
  }

  get (url, config) {
    return this.client.get(url, config);
  }

  post (url, body, config) {
    return this.client.post(url, body, config);
  }

  put (url, body, config) {
    return this.client.put(url, body, config);
  }

  delete (url, config) {
    return this.client.delete(url, config);
  }

  patch (url, body, config) {
    return this.client.patch(url, body, config);
  }
}

