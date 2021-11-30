import { JSDOM, CookieJar, DOMWindow } from 'jsdom';
import { BundleRenderer } from 'vue-server-renderer';
import { renderingUserAgent } from './RenderingUserAgent';

declare const global: {
  [key: string]: any;
  [key: number]: any;
  window: DOMWindow;
  document: Document;
  location: Location;
  navigator: Navigator;
  localStorage: LocalStorage;
};

export interface LocalStorage {
  [key: string]: any;
  getItem: (key: string) => any;
  setItem: (key: string, value: any) => void;
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
  windowObjects?: Record<string, any>;
  rendererContext?: Record<string, any>; // Vue SSR 렌더러에 삽입할 컨텍스트
}

/**
 * JSDOM에서 구현되지 않았기 때문에 추가된 window.resizeTo() 폴리필 함수
 *
 * @see https://github.com/agilgur5/window-resizeto/blob/master/src/index.ts
 */
function resizeTo(window: DOMWindow, width: number, height: number) {
  type R = Record<any, any>;

  (window as R).innerWidth = width;
  (window as R).innerHeight = height;
  (window as R).outerWidth = width;
  (window as R).outerHeight = height;

  window.dispatchEvent(new window.Event('resize'));
}

function createLocalStorage(): LocalStorage {
  const storage = {};

  return {
    getItem(key: string): any {
      return storage[key] || null;
    },
    setItem(key: string, value: any) {
      storage[key] = value;
    },
  };
}

/**
 * Vue SSR 번들 렌더링 함수
 *
 * @param renderer 번들 렌더러
 * @param RenderingOption 렌더링 옵션
 */
export async function bundleRendering(
  renderer: BundleRenderer,
  {
    projectDomain,
    userAgent = '',
    cookieJar,
    windowSize: { width, height } = { width: 375, height: 812 },
    windowObjects = {},
    rendererContext = {},
  }: RenderingOption,
) {
  const { window } = new JSDOM(``, {
    url: projectDomain,
    userAgent: userAgent.toLowerCase() || renderingUserAgent.mobile.android,
    cookieJar,
  });

  global.window = window;
  global.document = window.document;
  global.location = window.location;
  global.navigator = window.navigator;
  global.localStorage = createLocalStorage();

  // 입력받은 윈도우 사이즈로 리사이즈
  resizeTo(global.window, width, height);

  // Window 객체에 바인드
  Object.entries(windowObjects).forEach(([field, value]) => {
    global.window[field] = value;
  });

  // Vue SSR 시작
  let result = '';

  try {
    result = await renderer.renderToString(rendererContext);
  } catch (err: any) {
    throw new Error(`There is an error when SSR bundleRendering ${err as string}`);
  } finally {
    global.window.close();
  }

  return result;
}
