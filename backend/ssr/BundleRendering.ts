import {createCookieJar as _createCookieJar, jsdom} from 'jsdom';
import {BundleRenderer} from "vue-server-renderer";
import {renderingUserAgent} from "./RenderingUserAgent";

declare const global;

/**
 * Vue SSR 번들 렌더링 함수
 *
 * @param renderer 번들 렌더러
 * @param RenderingOption 렌더링 옵션
 */
export async function bundleRendering(renderer: BundleRenderer,
                                      RenderingOption: RenderingOption): Promise<string> {

  global.document = jsdom(``, {
    url: RenderingOption.projectDomain,
    userAgent: RenderingOption?.userAgent.toLowerCase() || renderingUserAgent.mobile.android,
    cookieJar: RenderingOption.cookieJar
  });

  global.window = document.defaultView;
  global.location = window.location;
  global.navigator = window.navigator;
  global.localStorage = {
    getItem(key) {
      return this[key] || null;
    },
    setItem(key, value) {
      this[key] = value;
    }
  };
  global.window.resizeTo(RenderingOption?.windowSize?.width || 375,
                         RenderingOption?.windowSize?.height || 812);


  // Window 객체에 바인드
  for (let field in RenderingOption?.windowObjects) {
    if (!RenderingOption.windowObjects.hasOwnProperty(field)) continue;
    global.window[field] = RenderingOption.windowObjects[field];
  }

  // Vue SSR
  let result = '';
  try {
    result = await renderer.renderToString(RenderingOption.rendererContext || {});
  } catch (e) {
    throw new Error(`There is an error when SSR bundleRendering ${e}`)
  }

  // JSDOM close 이후 결과 반환
  global.window.close();
  return result;
}


/**
 * JSDOM에서 사용 가능한 CookieJar 객체를 생성하는 함수
 *
 * @param domain 쿠키를 적용할 도메인
 * @param cookieObject 쿠키 객체
 */
export function createCookieJar(domain: string, cookieObject: object): object {
  
  // 쿠키 문자열 생성
  let cookieString = '';
  for (let [key, value] of Object.entries(cookieObject)) {
    cookieString += `${key}=${value}; `;
  }
  
  // CookieJar 객체 생성
  const cookieJar = _createCookieJar();
  cookieJar.setCookie(cookieString, // 쿠키 문자열
                      domain, // 쿠키를 적용할 도메인 
                      {}, // 옵션
                      () => {} // 콜백
                      );
  return cookieJar;
}

/**
 * Vue SSR Rendering 처리를 위한 옵션
 */
export interface RenderingOption {
  /* JSDOM 설정 */
  projectDomain: string, // 쿠키 및 URL 도메인
  userAgent?: string, // 설정할 user agent
  cookieJar: object, // jsdom cookie jar
  windowSize?: { width: number, height: number }, // jsdom 윈도우 사이즈. 없으면 모바일임

  /* Vue SSR Renderer 설정 */
  windowObjects: object,
  rendererContext: object, // Vue SSR 렌더러에 삽입할 컨텍스트
}
