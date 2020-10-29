import { BundleRenderer } from "vue-server-renderer";
/**
 * Vue SSR 번들 렌더링 함수
 *
 * @param renderer 번들 렌더러
 * @param RenderingOption 렌더링 옵션
 */
export declare function bundleRendering(renderer: BundleRenderer, RenderingOption: RenderingOption): Promise<string>;
/**
 * JSDOM에서 사용 가능한 CookieJar 객체를 생성하는 함수
 *
 * @param domain 쿠키를 적용할 도메인
 * @param cookieObject 쿠키 객체
 */
export declare function createCookieJar(domain: string, cookieObject: object): object;
/**
 * Vue SSR Rendering 처리를 위한 옵션
 */
export interface RenderingOption {
    projectDomain: string;
    userAgent?: string;
    cookieJar: object;
    windowSize?: {
        width: number;
        height: number;
    };
    windowObjects: object;
    rendererContext: object;
}
