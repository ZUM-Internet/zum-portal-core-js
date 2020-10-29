"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
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
const Logger_1 = require("./util/Logger");
const VersionResponse_1 = require("./middleware/VersionResponse");
const ErrorResponse_1 = require("./middleware/ErrorResponse");
const ResourceLoader_1 = require("./util/ResourceLoader");
const Controller_1 = require("./decorator/Controller");
const ZumDecoratorType_1 = require("./decorator/ZumDecoratorType");
// express 객체 생성 및 컨테이너 등록
const app = express();
tsyringe_1.container.register(express, { useValue: app });
class BaseAppContainer {
    /**
     * Express App 컨테이너
     * @param options 생성 옵션
     * initMiddleWares 라우트 등록 전 설정할 미들웨어
     * dirname 백엔드 폴더
     */
    constructor(options) {
        var _a;
        const dirname = path.join(process.env.INIT_CWD, (options === null || options === void 0 ? void 0 : options.dirname) || './backend');
        // 파라미터/데코레이터로 입력된 초기 미들웨어 등록
        const middleware = Reflect.getMetadata(ZumDecoratorType_1.ZumDecoratorType.Middleware, Object.getPrototypeOf(this).constructor);
        if (middleware) { // 데코레이터 미들웨어 등록
            const middlewareArr = middleware.forEach ? middleware : [middleware];
            middlewareArr.forEach(func => app.use(func));
        }
        // 파라미터 미들웨어 등록
        (_a = options === null || options === void 0 ? void 0 : options.initMiddleWares) === null || _a === void 0 ? void 0 : _a.forEach(func => app.use(func));
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
        this.app.use((err, req, res, next) => {
            if (req.originalUrl === '/favicon.ico') { // 파비콘 요청인 경우 No Contents 전송
                res.sendStatus(204);
            }
            else { // 핸들링되지 않은 에러가 발생하면 500 전송
                Logger_1.default.error(`\n[FATAL ERROR!]\nUnhandled global error event! You must check application logic`, err);
                res.sendStatus(500);
            }
        });
        // 정리된 컨트롤러별 URL 핸들링을 시작
        Controller_1.urlInstall();
    }
    /**
     * 기본 미들웨어 등록
     */
    static middleWares() {
        // cookie parser
        app.use(cookieParser());
        // body parser
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        if (process.env.NODE_ENV === 'development') {
            // morgan (http access log)
            app.use(morgan(`${chalk_1.default.greenBright(':date[iso]')} ${chalk_1.default.blue(':method')} ${chalk_1.default.yellow(':status')} ${chalk_1.default.bold(':response-time')}ms :url`));
        }
        // --------------------------------------------
        app.use(CoTracker_1.default); // cotracker 미들웨어
        app.use(NoCacheHtml_1.default); // HTML 캐시 미적용
        app.use('/state/version', VersionResponse_1.default); // 버전 응답 미들웨어
        app.use('/state/log/:type/:message', ErrorResponse_1.default); // 에러 로그 응답 미들웨어
        // --------------------------------------------
    }
    /**
     * 에셋 폴더 및 템플릿 엔진 등록
     * @param dirname 프로젝트 메인 디렉토리
     */
    static templateAndAssets(dirname) {
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
//# sourceMappingURL=BaseAppContainer.js.map