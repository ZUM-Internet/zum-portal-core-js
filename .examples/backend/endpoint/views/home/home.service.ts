import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {BundleRenderer, createBundleRenderer} from "vue-server-renderer";
import * as fs from "fs";
import * as path from "path";
import {ConfigService} from "@nestjs/config";
import {renderingUserAgent, bundleRendering, createCookieJar} from "../../../../../backend";
import {Cron} from "@nestjs/schedule";
import {Cache} from "cache-manager";

const RESOURCES_PATH = path.join(process.env.INIT_CWD, process.env.BASE_PATH || '', 'resources');
const TEMPLATES_PATH = path.join(RESOURCES_PATH, 'templates');
const SSR_RESULT = 'SSR_RESULT';

@Injectable()
export class HomeService {

  private readonly renderer: BundleRenderer;
  private readonly emptyHtml: string;
  private readonly defaultHtml: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {

    // 개발시 사용될 기본 HTML
    this.emptyHtml = fs.readFileSync(path.join(TEMPLATES_PATH, '/index.html'), 'utf-8');
    this.defaultHtml = fs.readFileSync(path.join(TEMPLATES_PATH, '/dist/index.html'), 'utf-8');

    // 클라이언트 소스
    const clientManifest = require(path.join(RESOURCES_PATH, '/vue-ssr-client-manifest.json'));
    const html = fs.readFileSync(path.join(TEMPLATES_PATH, '/ssr_index.html'), 'utf-8');

    // SSR 번들 렌더러 생성
    const bundle = require(path.join(RESOURCES_PATH, '/vue-ssr-server-bundle.json'));
    this.renderer = createBundleRenderer(bundle, {
      runInNewContext: false,
      clientManifest: clientManifest,
      template: html,
    });

    this.ssr();

  }

  // SSR은 CPU 사용이 큰 작업이므로 캐싱을 고려할 것
  private async getHtmlBySSR(): Promise<string> {
    try {
      if (process.env.NODE_ENV !== 'production') {
        return this.emptyHtml;
      }
      console.time('start vue.js ssr rendering');

      // Vue.js SSR 수행 후 만들어진 HTML 반환
      const domain = `https://localhost:${this.configService.get('port')}`;
      const html = await bundleRendering(this.renderer, {
        projectDomain: domain,
        userAgent: renderingUserAgent.desktop.windowChrome,
        cookieJar: createCookieJar(domain, {}), // 쿠키 jar 생성
        windowObjects: {},
        rendererContext: {path: '/'},
      });
      console.timeEnd('start vue.js ssr rendering');

      return html;

    } catch (e) {
      console.error(e);

      // 에러 발생시 프론트엔드에서 Vue.js를 기동할 수 있도록 기본 html 구문을 전송할 것
      return this.defaultHtml;
    }
  }

  @Cron('0/15 * * * * *')
  public async ssr(): Promise<void> {
    await this.cacheManager.set(SSR_RESULT, await this.getHtmlBySSR(), { ttl: 0 });
  }

  public get ssrHTML(): Promise<string> {
    return this.cacheManager.get(SSR_RESULT);
  }

}