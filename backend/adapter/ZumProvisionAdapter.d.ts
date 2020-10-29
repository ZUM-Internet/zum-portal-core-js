/**
 * 줌 API 전용 어댑터
 */
import { AxiosPromise } from "axios";
export declare class ZumProvisionAdapter {
    /**
     * GET 요청
     * @param option 요청할 옵션
     */
    get<T>(option: AdapterOption<T>): AxiosPromise<T>;
    /**
     * POST 요청
     * @param option 요청할 옵션
     */
    post<T>(option: AdapterOption<T>): AxiosPromise<T>;
    /**
     * DELETE 요청
     * @param option 요청할 옵션
     */
    delete<T>(option: AdapterOption<T>): AxiosPromise<T>;
    /**
     * PUT 요청
     * @param option 요청할 옵션
     */
    put<T>(option: AdapterOption<T>): AxiosPromise<T>;
    /**
     * Axios 요청 메소드
     * @param method HTTP request 메소드
     * @param version 줌 provision API 버전
     * @param typeCheck 타입 체크를 위해 테스트할 함수
     * @param option 그 외 HTTP request 옵션
     */
    private request;
}
/**
 * 줌 어댑터 옵션
 */
export interface AdapterOption<T> {
    url: string;
    version?: string;
    params?: object;
    data?: object;
    headers?: object;
    stub?: object;
    typePredicate?: (value: T) => any | boolean;
}
