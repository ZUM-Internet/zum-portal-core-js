// @ts-nocheck
import {container} from "tsyringe";
import * as cookieParser from 'cookie-parser'
import * as path from 'path';
import * as express from "express";
import {Application, ErrorRequestHandler, NextFunction, Request, Response, RequestHandler} from "express";
import * as glob from 'glob';
import * as morgan from 'morgan';
import chalk from 'chalk';
import CoTracker from "./middleware/CoTracker";
import NoCacheHtml from "./middleware/NoCacheHtml";
import * as ejs from 'ejs';
import logger from "./util/Logger";
import VersionResponse from "./middleware/VersionResponse";
import ErrorResponse from "./middleware/ErrorResponse";
import {ResourcePath} from "./util/ResourceLoader";

// express 객체 생성 및 컨테이너 등록
const app = express();
container.register(express, { useValue: app });

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
    const dirname = path.join(process.env.INIT_CWD, options?.dirname || './backend');

    // 파라미터로 입력된 초기 미들웨어 등록
    options?.initMiddleWares?.forEach(app.use);

    // 템플릿 및 에셋 디렉토리 등록
    BaseAppContainer.templateAndAssets(dirname);

    // 기본 미들웨어 등록
    // 에셋보다 먼저 등록시 헤더가 붙지 않는 문제가 발생함
    BaseAppContainer.middleWares();
    
    // !반드시 미들웨어 등록 후 실행!
    // 객체 생성을 위해 js, ts 파일 import
    glob.sync(path.join(dirname, '/*/**/*.{js,ts}'))
            .filter(src => path.parse(path.basename(src)).name !== __filename)
            .forEach(src => require(src));

    // 어플리케이션 등록
    this.app = app;

    // Express 글로벌 예외 처리
    this.app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
      logger.error(`\n[FATAL ERROR!]`);
      logger.error(`Unhandled global error event! You must check application logic`, err.stack);
      next();
    })
  }

  /**
   * 기본 미들웨어 등록
   */
  private static middleWares() {
    // cookie parser
    app.use(cookieParser());

    // body parser
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    if (process.env.NODE_ENV === 'development') {
      // morgan (http access log)
      app.use(morgan(`${chalk.greenBright(':date[iso]')} ${chalk.blue(':method')} ${chalk.yellow(':status')} ${chalk.bold(':response-time')}ms :url`));
    }


    // --------------------------------------------
    app.use(CoTracker); // cotracker 미들웨어
    app.use(NoCacheHtml); // HTML 캐시 미적용
    app.use('/state/version', VersionResponse); // 버전 응답 미들웨어
    app.use('/state/log/:type/:message', ErrorResponse); // 에러 로그 응답 미들웨어
    // --------------------------------------------

  }


  /**
   * 에셋 폴더 및 템플릿 엔진 등록
   * @param dirname 프로젝트 메인 디렉토리
   */
  private static templateAndAssets(dirname) {
    ejs.delimiter = '?';
    ejs.open = '?';
    ejs.close = '?';

    // static 폴더 URL 및 헤더 설정
    app.use('/static', express.static(path.join(dirname, '../resources/static'), {
      cacheControl: true,
      maxAge: 3600 * 1000,
      etag: false
    }));

    // favicon, robots, sitemap 등록
    ['favicon.ico', 'robots.txt', 'sitemap.xml'].forEach(filename => {
      app.get(`/${filename}`, (req, res) => res.sendFile(ResourcePath(`/static/${filename}`)));
    });

    // 템플릿 폴더 및 엔진 설정
    app.set('views', path.join(dirname, '../resources/templates/'));
    app.set('view engine', 'ejs');
    app.engine('html', ejs.renderFile);
  }
}
