"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachMiddleWares = void 0;
// @ts-nocheck
const Sentry = require("@sentry/node");
const tsyringe_1 = require("tsyringe");
const cookieParser = require("cookie-parser");
const path = require("path");
const express = require("express");
const glob = require("glob");
const morgan = require("morgan");
const chalk_1 = require("chalk");
const CoTracker_1 = require("./middleware/CoTracker");
const NoCacheHtml_1 = require("./middleware/NoCacheHtml");
const ejs = require("ejs");
const VersionResponse_1 = require("./middleware/VersionResponse");
const ErrorResponse_1 = require("./middleware/ErrorResponse");
const ResourceLoader_1 = require("./util/ResourceLoader");
const Controller_1 = require("./decorator/Controller");
const ZumDecoratorType_1 = require("./decorator/ZumDecoratorType");
const yamlConfig = require("node-yaml-config");
class BaseAppContainer {
    /**
     * Express App 컨테이너
     * @param options 생성 옵션
     * initMiddleWares 라우트 등록 전 설정할 미들웨어
     * dirname 백엔드 폴더
     */
    constructor(options) {
        var _a;
        const sentryOptions = getSentryOptions();
        const dirname = path.join(process.env.INIT_CWD, (options === null || options === void 0 ? void 0 : options.dirname) || './backend');
        // express 객체 생성 및 컨테이너 등록
        const app = express();
        this.app = app;
        app.set('trust proxy', true);
        tsyringe_1.container.register(express, { useValue: this.app });
        // 파라미터 미들웨어 등록
        (_a = options === null || options === void 0 ? void 0 : options.initMiddleWares) === null || _a === void 0 ? void 0 : _a.forEach(func => this.app.use(func));
        // 파라미터/데코레이터로 입력된 초기 미들웨어 등록
        const middleware = Reflect.getMetadata(ZumDecoratorType_1.ZumDecoratorType.Middleware, Object.getPrototypeOf(this).constructor);
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
            app.use(Sentry.Handlers.requestHandler(Object.assign(Object.assign({}, sentryOptions), { dsn: null })));
        }
        // 2. 센트리 에러 핸들러 등록
        if (sentryOptions) {
            app.use(Sentry.Handlers.errorHandler());
        }
        // 3. Express 글로벌 예외 처리
        this.app.use((err, req, res, next) => {
            if (req.originalUrl === '/favicon.ico') { // 파비콘 요청인 경우 No Contents 전송
                return res.sendStatus(204);
            }
            res.statusCode = 500;
            res.end(res.sentry + "\n");
        });
        // 4. app URL 설치
        Controller_1.urlInstall();
    }
    /**
     * 에셋 폴더 및 템플릿 엔진 등록
     * @param app app
     * @param dirname 프로젝트 메인 디렉토리
     */
    templateAndAssets(app, dirname) {
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
            app.get(`/${filename}`, (req, res) => res.sendFile(ResourceLoader_1.ResourcePath(`/static/${filename}`)));
        });
        // 템플릿 폴더 및 엔진 설정
        app.set('views', path.join(dirname, '../resources/templates/'));
        app.set('view engine', 'ejs');
        app.engine('html', ejs.renderFile);
    }
}
exports.default = BaseAppContainer;
/**
 * 기본 미들웨어 등록
 */
function attachMiddleWares(app) {
    if (!app)
        return;
    // cookie parser
    app.use(cookieParser());
    // body parser
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // morgan (http access log)
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan(`${chalk_1.default.greenBright(':date[iso]')} ${chalk_1.default.blue(':method')} ${chalk_1.default.yellow(':status')} ${chalk_1.default.bold(':response-time')}ms :url`));
    }
    // --------------------------------------------
    app.use(CoTracker_1.default); // cotracker 미들웨어
    app.use(NoCacheHtml_1.default); // HTML 캐시 미적용
    app.use('/state/version', VersionResponse_1.default); // 버전 응답 미들웨어
    app.use('/state/log/:type/:message', ErrorResponse_1.default); // 에러 로그 응답 미들웨어
    // --------------------------------------------
}
exports.attachMiddleWares = attachMiddleWares;
function getSentryOptions() {
    const files = glob.sync(path.join(process.env.INIT_CWD, `./resources/**/application.{yaml,yml}`));
    if (files.length) {
        return yamlConfig.load(files[0]).sentry;
    }
    else {
        console.log(`Cannot found application.yml file. setup default.`);
        return {};
    }
}
//# sourceMappingURL=BaseAppContainer.js.map