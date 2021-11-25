import { CookieJar } from 'jsdom';

export function createCookieStringFromObject(cookieObject: Record<string, string>) {
  return Object.entries(cookieObject)
    .map(([key, value]) => `${key}=${value};`)
    .join(' ');
}

/**
 * JSDOM에서 사용 가능한 CookieJar 객체를 생성하는 함수
 *
 * @param domain 쿠키를 적용할 도메인
 * @param cookieObject 쿠키 객체
 */
export function createCookieJar(domain: string, cookieObject: Record<string, string>) {
  const cookieString = createCookieStringFromObject(cookieObject);
  const cookieJar = new CookieJar();

  return cookieJar.setCookie(cookieString, domain);
}
