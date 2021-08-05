import { JSDOM, CookieJar } from "jsdom";
import { BundleRenderer } from "vue-server-renderer";
import { renderingUserAgent } from "./RenderingUserAgent";

declare const global: Record<any, any>;

/**
 * Vue SSR 번들 렌더링 함수
 *
 * @param renderer 번들 렌더러
 * @param RenderingOption 렌더링 옵션
 */
export async function bundleRendering(
  renderer: BundleRenderer,
  RenderingOption: RenderingOption
): Promise<string> {
  const { window } = new JSDOM(``, {
    url: RenderingOption.projectDomain,
    userAgent:
      RenderingOption?.userAgent.toLowerCase() ||
      renderingUserAgent.mobile.android,
    cookieJar: RenderingOption.cookieJar,
  });
  const width = RenderingOption?.windowSize?.width || 375;
  const height = RenderingOption?.windowSize?.height || 812;

  global.window = window;
  global.document = window.document;
  global.location = window.location;
  global.navigator = window.navigator;
  global.localStorage = {
    getItem(key: string) {
      return this[key] || null;
    },
    setItem(key: string, value: any) {
      this[key] = value;
    },
  };

  // 모바일 사이즈로 리사이즈
  global.window.innerWidth = width;
  global.window.innerHeight = height;
  global.window.outerWidth = width;
  global.window.outerHeight = height;
  global.window.dispatchEvent(new window.Event("resize"));

  // Window 객체에 바인드
  for (let field in RenderingOption?.windowObjects) {
    if (!RenderingOption.windowObjects.hasOwnProperty(field)) continue;
    global.window[field] = RenderingOption.windowObjects[field];
  }

  // Vue SSR
  let result = "";
  try {
    result = await renderer.renderToString(
      RenderingOption.rendererContext || {}
    );
  } catch (e) {
    throw new Error(`There is an error when SSR bundleRendering ${e}`);
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
export function createCookieJar(
  domain: string,
  cookieObject: Record<string, string>
): CookieJar {
  // 쿠키 문자열 생성
  let cookieString = "";
  for (let [key, value] of Object.entries(cookieObject)) {
    cookieString += `${key}=${value}; `;
  }

  // CookieJar 객체 생성
  const cookieJar = new CookieJar();
  cookieJar.setCookie(
    cookieString, // 쿠키 문자열
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
  projectDomain: string; // 쿠키 및 URL 도메인
  userAgent?: string; // 설정할 user agent
  cookieJar: CookieJar; // jsdom cookie jar
  windowSize?: { width: number; height: number }; // jsdom 윈도우 사이즈. 없으면 모바일임

  /* Vue SSR Renderer 설정 */
  windowObjects: Record<string, any>;
  rendererContext: Record<string, any>; // Vue SSR 렌더러에 삽입할 컨텍스트
}
