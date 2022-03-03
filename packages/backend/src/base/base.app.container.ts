import cookieParser from 'cookie-parser';
import { join } from 'path';
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import ejs from 'ejs';
import { NestFactory } from '@nestjs/core';
import { HttpStatus, NestApplicationOptions } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NoCacheHtml, getVersion } from '../middleware';
import { logger } from '../util';
import { setYmlResourcePath } from './yml.configuration';

// 와탭 에이전트 등록
if (process.env.ENABLE_WHATAP === 'true') {
  // eslint-disable-next-line
  require('whatap').NodeAgent;
}

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

  private async initialize({
    AppModule,
    option,
    nestApplicationOptions,
  }: {
    AppModule: any;
    option: AppSetupOption;
    nestApplicationOptions: NestApplicationOptions;
  }) {
    this.RESOURCE_PATH = option.resourcePath ?? join(process.env.INIT_CWD, '../resources');
    this.STATIC_PATH = option.staticPath ?? join(this.RESOURCE_PATH, 'static');
    this.TEMPLATE_PATH = option.templatePath ?? join(this.RESOURCE_PATH, 'templates');

    setYmlResourcePath(this.RESOURCE_PATH);

    this.app = await NestFactory.create<NestExpressApplication>(AppModule, nestApplicationOptions);
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
    this.app
      .useStaticAssets(this.STATIC_PATH, {
        maxAge: '14d',
        etag: false,
      })
      .use(
        '/static',
        express.static(this.STATIC_PATH, {
          maxAge: '14d',
          etag: false,
          setHeaders(res, path) {
            if (path.endsWith('.js') || path.endsWith('.css')) {
              res.setHeader('Cache-Control', 'public, max-age=31536000');
            }
          },
        }),
      );

    return this;
  }

  private registerCustomMiddleware() {
    this.app
      .use(NoCacheHtml) // HTML 캐시 미적용
      .use('/state/version', getVersion); // 버전 응답

    return this;
  }

  private registerParserMiddleware() {
    this.app
      .use(cookieParser())
      .use(express.json())
      .use(express.urlencoded({ extended: true, limit: 1024 * 1024 * 5 })); // post size 5mb 용량 제한

    return this;
  }

  async setup(
    AppModule: any,
    option: AppSetupOption = {},
    nestApplicationOptions: NestApplicationOptions = {},
  ) {
    await this.initialize({ AppModule, option, nestApplicationOptions });

    this.app.set('trust proxy', true);

    return this.registerStaticMiddleware()
      .registerTemplateEngine(option.ejsDelimiter)
      .registerParserMiddleware()
      .registerCustomMiddleware()
      .registerErrorHandler()
      .listen(this.app);
  }

  abstract listen(app: NestExpressApplication): Promise<void>;
}
