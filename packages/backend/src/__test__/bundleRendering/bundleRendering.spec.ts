import { CookieJar, toughCookie } from 'jsdom';
import { BundleRenderer } from 'vue-server-renderer';
import { bundleRendering, createCookieJar } from '../../index';

describe('bundleRendering', () => {
  let renderer: BundleRenderer;
  let renderToStringSpy: jest.SpyInstance;

  beforeEach(() => {
    renderer = { renderToString() {} } as BundleRenderer;
    renderToStringSpy = jest.spyOn(renderer, 'renderToString');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('window 객체를 생성해서 전역 스코프에 바인딩하여야 한다', async () => {
    const domain = 'https://test.com';
    const cookieJar = await createCookieJar(domain, {});
    const renderOption = {
      projectDomain: domain,
      cookieJar,
    };

    await bundleRendering(renderer, renderOption);

    expect(window).toBeTruthy();
    expect(document).toBeTruthy();
    // eslint-disable-next-line no-restricted-globals
    expect(location).toBeTruthy();
    expect(navigator).toBeTruthy();
    expect(localStorage).toBeTruthy();
  });

  it('생성된 window객체에 전달한 windowObjects 프로퍼티가 바인딩되어야 한다', async () => {
    const domain = 'https://test.com';
    const cookieJar = new CookieJar();
    const windowObjects = { a: 123, foo: 'bar', zum: 'internet', so: { sad: 'ㅜ' } };
    const renderOption = {
      projectDomain: domain,
      cookieJar,
      windowObjects,
    };

    await bundleRendering(renderer, renderOption);

    expect(window).toMatchObject(windowObjects);
  });

  it('window 객체를 생성할 때 전달한 cookieJar의 쿠키값들이 바인딩되어야 한다', async () => {
    const url = 'https://test.com';
    const cookieJar = new CookieJar();
    const renderOption = {
      projectDomain: url,
      cookieJar,
    };

    cookieJar.setCookieSync(toughCookie.Cookie.parse('cookie=test'), url);
    cookieJar.setCookieSync(toughCookie.Cookie.parse('hey=ho'), url);

    await bundleRendering(renderer, renderOption);

    expect(document.cookie).toEqual('cookie=test; hey=ho');
  });

  it('SSR할 때 전달한 컨텍스트 객체가 renderer.renderToString()의 파라미터로 전달되어야 한다', async () => {
    const domain = 'https://test.com';
    const rendererContext = { path: '/about', foo: 1234 };
    const cookieJar = new CookieJar();
    const renderOption = {
      projectDomain: domain,
      cookieJar,
      rendererContext,
    };

    await bundleRendering(renderer, renderOption);

    expect(renderToStringSpy).toHaveBeenCalledWith(rendererContext);
  });
});
