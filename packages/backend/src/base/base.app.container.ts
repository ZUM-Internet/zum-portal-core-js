import cookieParser from 'cookie-parser';
import { join } from 'path';
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import ejs from 'ejs';
import { NestFactory } from '@nestjs/core';
import { HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CoTracker, NoCacheHtml, ErrorResponse, getVersion } from '../middleware';
import { logger } from '../util';
import { setYmlResourcePath } from './yml.configuration';

interface AppSetupOption {
  resourcePath?: string;
  staticPath?: string;
  templatePath?: string;
  ejsDelimiter?: string;
}

/**
 * Express App 컨테이너
 */
export abstract class BaseAppContainer {
  private app: NestExpressApplication;

  private RESOURCE_PATH: string;

  private STATIC_PATH: string;

  private TEMPLATE_PATH: string;

  private async initialize({ AppModule, option }: { AppModule: any; option: AppSetupOption }) {
    this.RESOURCE_PATH = option.resourcePath ?? join(process.env.INIT_CWD, '../resources');
    this.STATIC_PATH = option.staticPath ?? join(this.RESOURCE_PATH, 'static');
    this.TEMPLATE_PATH = option.templatePath ?? join(this.RESOURCE_PATH, 'templates');

    this.app = await NestFactory.create<NestExpressApplication>(AppModule);
  }

  private registerWhatapAgent() {
    if (process.env.ENABLE_WHATAP === 'true') {
      import('whatap').then(({ NodeAgent }) => NodeAgent as unknown).catch(logger.error.bind(logger));
    }

    return this;
  }

  private registerTemplateEngine(delimiter = '?') {
    this.app
      .set('views', this.TEMPLATE_PATH)
      .set('view engine', 'ejs')
      .set('view options', { delimiter })
      .engine('html', ejs.renderFile);

    return this;
  }

  private registerErrorHandler() {
    // Express 글로벌 예외 처리
    this.app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
      if (req.originalUrl === '/favicon.ico') {
        // 파비콘 요청인 경우 No Contents 전송
        res.sendStatus(HttpStatus.NO_CONTENT);
        return;
      }

      logger.error('internal server error', err);
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    return this;
  }

  private registerStaticMiddleware() {
    this.app.useStaticAssets(this.STATIC_PATH).use(
      '/static',
      express.static(this.STATIC_PATH, {
        cacheControl: true,
        maxAge: 3600 * 1000,
        etag: false,
      }),
    );

    // favicon, robots 등록. sitemap은 동적 생성할 가능성이 있어 제외함(직접등록)
    ['favicon.ico', 'robots.txt'].forEach((filename) => {
      this.app.use(`/${filename}`, (req: Request, res: Response) => {
        res.sendFile(join(this.STATIC_PATH, filename));
      });
    });

    return this;
  }

  private registerCustomMiddleware() {
    this.app
      .use(CoTracker) // cotracker 미들웨어
      .use(NoCacheHtml) // HTML 캐시 미적용
      .use('/state/version', getVersion) // 버전 응답
      .use('/state/log/:type/:message', ErrorResponse); // 에러 로그 응답 미들웨어

    return this;
  }

  private registerParserMiddleware() {
    this.app
      .use(cookieParser())
      .use(express.json())
      .use(express.urlencoded({ extended: true, limit: 1024 * 1024 * 5 })); // post size 5mb 용량 제한

    return this;
  }

  async setup(AppModule: any, option: AppSetupOption = {}) {
    await this.initialize({ AppModule, option });

    this.app.set('trust proxy', true);

    setYmlResourcePath(this.RESOURCE_PATH);

    return this.registerWhatapAgent()
      .registerStaticMiddleware()
      .registerTemplateEngine(option.ejsDelimiter)
      .registerParserMiddleware()
      .registerCustomMiddleware()
      .registerErrorHandler()
      .listen(this.app);
  }

  abstract listen(app: NestExpressApplication): Promise<void>;
}
