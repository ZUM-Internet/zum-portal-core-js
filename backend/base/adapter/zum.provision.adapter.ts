import {Injectable} from "@nestjs/common";
import Axios, { AxiosPromise, Method } from "axios";
import deepmerge = require("deepmerge");

/**
 * 줌 어댑터 옵션
 */
export interface AdapterOption<T> {
  url: string, // 요청 URL
  version?: string, // 요청 버전
  params?: object, // 요청 파라미터
  data?: object, // 요청 데이터
  headers?: object, // 요청 헤더
  stub?: object // publish 모드에서 사용할 stub 데이터
  typePredicate?: (value: T) => any | boolean // 응답 데이터 타입 체크 함수
}


@Injectable()
export class ZumProvisionAdapter {

  /**
   * GET 요청
   * @param option 요청할 옵션
   */
  public get<T>(option: AdapterOption<T>): AxiosPromise<T> {
    return this.request<T>('get', option);
  }

  /**
   * POST 요청
   * @param option 요청할 옵션
   */
  public post<T>(option: AdapterOption<T>): AxiosPromise<T> {
    return this.request<T>('post', option);
  }

  /**
   * DELETE 요청
   * @param option 요청할 옵션
   */
  public delete<T>(option: AdapterOption<T>): AxiosPromise<T> {
    return this.request<T>('delete', option);
  }

  /**
   * PUT 요청
   * @param option 요청할 옵션
   */
  public put<T>(option: AdapterOption<T>): AxiosPromise<T> {
    return this.request<T>('put', option);
  }


  /**
   * Axios 요청 메소드
   * @param method HTTP request 메소드
   * @param version 줌 provision API 버전
   * @param typeCheck 타입 체크를 위해 테스트할 함수
   * @param option 그 외 HTTP request 옵션
   */
  private request<T>(
    method: Method,
    {
      version,
      typePredicate = Boolean,
      ...option
    }: AdapterOption<T>
  ): AxiosPromise<T> {

    // publish모드이며 stub 데이터를 설정한 경우 지정된 값을 반환
    if (option.stub && process.env.ZUM_BACK_MODE === 'publish') {
      return Promise.resolve({
        data: option.stub,
        status: 200,
        statusText: 'ok',
        headers: [],
        config: option,
        request: method
      }) as AxiosPromise;
    }

    return Axios(deepmerge(option, {
      method,
      timeout: 1500,
      headers: Boolean(version) ? {Accept: `application/vnd.zum.resource-${version}+json`} : {},
    }))
      .then(response => {
        // 타입 체크 시도
        if (typePredicate && !typePredicate(response.data)) {
          const { status, statusText, data } = response;
          throw new Error(
            `\n[Type Check Error!] `
            + `There is an error when Axios fetching ${option.url}. Response can not pass type check!\n`
            + `response status: ${status} ${statusText}\n`
            + `response data: ${data}\n\n`
          );
        }
        return response;
      });

  }
}