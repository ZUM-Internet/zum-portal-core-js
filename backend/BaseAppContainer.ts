// @ts-nocheck
import * as Sentry from "@sentry/node";
import {container} from "tsyringe";
import * as cookieParser from 'cookie-parser'
import * as path from 'path';
import * as express from "express";
import {Application, ErrorRequestHandler, NextFunction, Request, RequestHandler, Response} from "express";
import * as glob from 'glob';
import * as morgan from 'morgan';
import chalk from 'chalk';
import CoTracker from "./middleware/CoTracker";
import NoCacheHtml from "./middleware/NoCacheHtml";
import * as ejs from 'ejs';
import VersionResponse from "./middleware/VersionResponse";
import ErrorResponse from "./middleware/ErrorResponse";
import {ResourcePath} from "./util/ResourceLoader";
import {urlInstall} from "./decorator/Controller";
import {ZumDecoratorType} from "./decorator/ZumDecoratorType";
import * as yamlConfig from 'node-yaml-config';

// 와탭 모니터링 에이전트 등록
if (process.env.ENABLE_WHATAP === 'true') {
  require('whatap').NodeAgent;
}



export default abstract class BaseAppContainer {
  public app: Application;

  /**
   * Express App 컨테이너
   * @param options 생성 옵션
   * initMiddleWares 라우트 등록 전 설정할 미들웨어
   * dirname 백엔드 폴더
   */
  protected constructor(options?: {
                                    initMiddleWares?: Array<RequestHandler>
                                    dirname?: string
                                  }) {

    const sentryOptions = getSentryOptions();
    const dirname = path.join(process.env.INIT_CWD, process.env.BASE_PATH || '', options?.dirname || './backend');

    // express 객체 생성 및 컨테이너 등록
    const app = express();
    this.app = app;
    app.set('trust proxy', true);
    container.register(express, { useValue: this.app });

    // 파라미터 미들웨어 등록
    options?.initMiddleWares?.forEach(func => this.app.use(func));

    // 파라미터/데코레이터로 입력된 초기 미들웨어 등록
    const middleware = Reflect.getMetadata(ZumDecoratorType.Middleware, Object.getPrototypeOf(this).constructor);
    if (middleware) { // 데코레이터 미들웨어 등록
      const middlewareArr = middleware.forEach ? middleware : [middleware];
      middlewareArr.forEach(func => this.app.use(func));
    }

    // 템플릿 및 에셋 디렉토리 등록
    this.templateAndAssets(this.app, dirname);

    // 기본 미들웨어 등록
    // 에셋보다 먼저 등록시 헤더가 붙지 않는 문제가 발생함
    attachMiddleWares(this.app);


    // 객체 생성을 위해 js, ts 파일 import (반드시 미들웨어 등록 후 실행)
    glob.sync(path.join(dirname, '/*/**/*.{js,ts}'))
            .filter(src => path.parse(path.basename(src)).name !== __filename)
            .forEach(src => require(src));



    // 1. 센트리 리퀘스트 핸들러 등록
    if (sentryOptions) {
      Sentry.init({ dsn: sentryOptions.dsn });
      app.use(Sentry.Handlers.requestHandler({...sentryOptions, dsn: null}));
    }

    // 2. 센트리 에러 핸들러 등록
    if (sentryOptions) {
      app.use(Sentry.Handlers.errorHandler());
    }


    // 3. Express 글로벌 예외 처리
    this.app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
      if (req.originalUrl === '/favicon.ico') { // 파비콘 요청인 경우 No Contents 전송
        return res.sendStatus(204);
      }

      res.statusCode = 500;
      res.end(res.sentry + "\n");
    });


    // 4. app URL 설치
    urlInstall();


  }
  /**
   * 에셋 폴더 및 템플릿 엔진 등록
   * @param app app
   * @param dirname 프로젝트 메인 디렉토리
   */
  private templateAndAssets(app, dirname) {
    ejs.delimiter = '?';
    ejs.open = '?';
    ejs.close = '?';

    // static 폴더 URL 및 헤더 설정
    app.use('/static', express.static(path.join(dirname, '../resources/static'), {
      cacheControl: true,
      maxAge: 3600 * 1000,
      etag: false
    }));

    // favicon, robots 등록. sitemap은 동적 생성할 가능성이 있어 제외함(직접등록)
    ['favicon.ico', 'robots.txt'].forEach(filename => {
      app.get(`/${filename}`, (req, res) => res.sendFile(ResourcePath(`/static/${filename}`)));
    });

    // 템플릿 폴더 및 엔진 설정
    app.set('views', path.join(dirname, '../resources/templates/'));
    app.set('view engine', 'ejs');
    app.engine('html', ejs.renderFile);
  }

}


/**
 * 기본 미들웨어 등록
 */
export function attachMiddleWares(app) {
  if (!app) return;

  // cookie parser
  app.use(cookieParser());

  // body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  // morgan (http access log)
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan(`${chalk.greenBright(':date[iso]')} ${chalk.blue(':method')} ${chalk.yellow(':status')} ${chalk.bold(':response-time')} ms :url`));
  }


  // --------------------------------------------
  app.use(CoTracker); // cotracker 미들웨어
  app.use(NoCacheHtml); // HTML 캐시 미적용
  app.use('/state/version', VersionResponse); // 버전 응답 미들웨어
  app.use('/state/log/:type/:message', ErrorResponse); // 에러 로그 응답 미들웨어
  // --------------------------------------------

}


function getSentryOptions() {
  const files = glob.sync(path.join(process.env.INIT_CWD, process.env.BASE_PATH || '', `./resources/**/application.{yaml,yml}`));
  if (files.length) {
    return yamlConfig.load(files[0]).sentry;
  } else {
    console.log(`Cannot found application.yml file. setup default.`);
    return {};
  }
}
