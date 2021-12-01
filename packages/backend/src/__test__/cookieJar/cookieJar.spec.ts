import { CookieJar } from 'jsdom';
import { createCookieJar, parseCookiesFromObject } from '../../index';

describe('parseCookiesFromObject', () => {
  it('쿠키 정보 객체를 쿠키 배열로 변환하여 반환해야 한다', () => {
    const cookieRecord = { foo: 'bar', zum: 'internet' };
    const cookies = parseCookiesFromObject(cookieRecord);

    expect(cookies).toHaveLength(2);
    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'foo', value: 'bar' }),
        expect.objectContaining({ key: 'zum', value: 'internet' }),
      ]),
    );
  });

  it('빈 객체를 전달하면 빈 배열을 반환해야 한다', () => {
    const cookieRecord = {};
    const cookies = parseCookiesFromObject(cookieRecord);

    expect(cookies).toEqual([]);
  });
});

describe('createCookieJar', () => {
  it('cookieJar 객체를 생성하여 반환해야 한다', async () => {
    const domain = 'https://zum.com';
    const cookieRecord = { test: 'cookie-test', foo: 'bar', me: 'you' };
    const cookieJar = await createCookieJar(domain, cookieRecord);

    expect(cookieJar).toBeInstanceOf(CookieJar);
    expect(cookieJar.getCookiesSync(domain)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ domain: 'zum.com', key: 'test', value: 'cookie-test' }),
        expect.objectContaining({ domain: 'zum.com', key: 'foo', value: 'bar' }),
        expect.objectContaining({ domain: 'zum.com', key: 'me', value: 'you' }),
      ]),
    );
  });
});
