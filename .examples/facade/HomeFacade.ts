import {Facade} from "../../backend/decorator/Alias";
import * as path from 'path';
import {bundleRendering, createCookieJar} from "../../backend/ssr/BundleRendering";
import {renderingUserAgent} from '../../backend/ssr/RenderingUserAgent';
import {BundleRenderer, createBundleRenderer} from "vue-server-renderer";

const domain = 'http://localhost:8080';

@Facade()
export default class HomeFacade {

  private readonly renderer;

  constructor() {

    // SSR 번들 렌더러 생성
    const bundle = require(path.join(process.env.INIT_CWD, '/resources/vue-ssr-server-bundle.json'));
    const clientManifest = require(path.join(process.env.INIT_CWD, '/resources/vue-ssr-client-manifest.json'));
    this.renderer = createBundleRenderer(bundle, {
      runInNewContext: false,
      clientManifest: clientManifest,
      template: `<html lang="ko"><body><!--vue-ssr-outlet--></body></html>`
    });

  }

  // SSR은 CPU 사용이 큰 작업이므로 캐싱을 고려할 것
  public async getRenderedHtml(): Promise<string> {
    try {
      console.time('start vue.js ssr rendering');

      // Vue.js SSR 수행 후 만들어진 HTML 반환
      const html = await bundleRendering(this.renderer, {
        projectDomain: domain,
        userAgent: renderingUserAgent.desktop.windowChrome,
        cookieJar: createCookieJar(domain, {}), // 쿠키 jar 생성
        windowObjects: {},
        rendererContext: {path: '/'}
      });
      console.timeEnd('start vue.js ssr rendering');

      return html;

    } catch (e) {
      console.error(e);
      // 에러 발생시 프론트엔드에서 Vue.js를 기동할 수 있도록 기본 html 구문을 전송할 것
      return `<html lang="ko"><body><div id="app"></div></body></html>`;
    }
  }


}
