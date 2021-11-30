import { CookieJar, toughCookie } from 'jsdom';

export function parseCookiesFromObject(cookieObject: Record<string, string>) {
  return Object.entries(cookieObject).map(([key, value]) => toughCookie.Cookie.parse(`${key}=${value}`));
}

/**
 * JSDOM에서 사용 가능한 CookieJar 객체를 생성하는 함수
 *
 * @param domain 쿠키를 적용할 도메인
 * @param cookieObject 쿠키 객체
 */
export function createCookieJar(domain: string, cookieObject: Record<string, string>) {
  const cookies = parseCookiesFromObject(cookieObject);
  const cookieJar = new CookieJar();

  return Promise.all(cookies.map((cookie) => cookieJar.setCookie(cookie, domain))).then(() => cookieJar);
}
