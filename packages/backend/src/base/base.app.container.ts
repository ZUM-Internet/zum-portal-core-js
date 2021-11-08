import cookieParser from 'cookie-parser';
import { join } from 'path';
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import ejs from 'ejs';
import { NestFactory } from '@nestjs/core';
import { HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CoTracker, NoCacheHtml, ErrorResponse } from '../middleware';
import { getVersion, logger } from '../util';
import { setYmlResourcePath } from './yml.configuration';

// 와탭 모니터링 에이전트 등록
if (process.env.ENABLE_WHATAP === 'true') {
  import('whatap').then(({ NodeAgent }) => NodeAgent as unknown).catch(() => {});
}

interface AppSetupOption {
  resourcePath?: string;
  staticPath?: string;
  templatePath?: string;
  ejsDelimiter?: string;
}

export abstract class BaseAppContainer {
  /**
   * Express App 컨테이너
   */
  async setup(AppModule: any, option: AppSetupOption = {}) {
    const RESOURCE_PATH = option.resourcePath ?? join(process.env.INIT_CWD, '../resources');
    const STATIC_PATH = option.staticPath ?? join(RESOURCE_PATH, 'static');
    const TEMPLATE_PATH = option.templatePath ?? join(RESOURCE_PATH, 'templates');

    // yml 파일 경로 설정
    setYmlResourcePath(RESOURCE_PATH);

    // express 객체 생성 및 컨테이너 등록
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.set('trust proxy', true);

    /** 에셋 폴더 및 템플릿 엔진 등록 * */
    /** ===========================* */

    // static 폴더 URL 및 헤더 설정
    app.useStaticAssets(STATIC_PATH);
    app.use(
      '/static',
      express.static(STATIC_PATH, {
        cacheControl: true,
        maxAge: 3600 * 1000,
        etag: false,
      }),
    );

    // favicon, robots 등록. sitemap은 동적 생성할 가능성이 있어 제외함(직접등록)
    ['favicon.ico', 'robots.txt'].forEach((filename) => {
      app.use(`/${filename}`, (req: Request, res: Response) => {
        res.sendFile(join(STATIC_PATH, filename));
      });
    });

    // 템플릿 폴더 및 엔진 설정
    app.set('views', TEMPLATE_PATH);
    app.set('view engine', 'ejs');
    app.set('view options', {
      delimiter: option.ejsDelimiter ?? '?',
    });
    app.engine('html', ejs.renderFile);

    /** ===========================* */

    // cookie parser
    app.use(cookieParser());

    // body parser
    app.use(express.json());
    app.use(express.urlencoded({ extended: true, limit: 1024 * 1024 * 5 })); // post size 5mb 용량 제한

    // --------------------------------------------
    app.use(CoTracker); // cotracker 미들웨어
    app.use(NoCacheHtml); // HTML 캐시 미적용
    app.use('/state/version', (req: Request, res: Response) => res.send(getVersion())); // 버전 응답
    app.use('/state/log/:type/:message', ErrorResponse); // 에러 로그 응답 미들웨어
    // --------------------------------------------

    // Express 글로벌 예외 처리
    app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
      if (req.originalUrl === '/favicon.ico') {
        // 파비콘 요청인 경우 No Contents 전송
        res.sendStatus(HttpStatus.NO_CONTENT);
        return;
      }

      logger.error('internal server error', err);

      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    await this.listen(app);
  }

  abstract listen(app: NestExpressApplication): Promise<void>;
}
