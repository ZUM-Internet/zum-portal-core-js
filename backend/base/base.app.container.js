"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAppContainer = void 0;
const cookieParser = require("cookie-parser");
const path_1 = require("path");
const express = require("express");
const ejs = require("ejs");
const core_1 = require("@nestjs/core");
const middleware_1 = require("../middleware");
const util_1 = require("../util");
// 와탭 모니터링 에이전트 등록
if (process.env.ENABLE_WHATAP === 'true') {
    require('whatap').NodeAgent;
}
class BaseAppContainer {
    /**
     * Express App 컨테이너
     */
    setup(AppModule) {
        return __awaiter(this, void 0, void 0, function* () {
            const RESOURCE_PATH = path_1.join(process.env.INIT_CWD, process.env.BASE_PATH || '', 'resources');
            const STATIC_PATH = path_1.join(RESOURCE_PATH, './static');
            const TEMPLATE_PATH = path_1.join(RESOURCE_PATH, './templates');
            // express 객체 생성 및 컨테이너 등록
            const app = yield core_1.NestFactory.create(AppModule);
            app.set('trust proxy', true);
            /** 에셋 폴더 및 템플릿 엔진 등록 **/
            /**===========================**/
            ejs.delimiter = '?';
            ejs.open = '?';
            ejs.close = '?';
            // static 폴더 URL 및 헤더 설정
            app.useStaticAssets(STATIC_PATH);
            app.use('/static', express.static(STATIC_PATH, {
                cacheControl: true,
                maxAge: 3600 * 1000,
                etag: false
            }));
            // favicon, robots 등록. sitemap은 동적 생성할 가능성이 있어 제외함(직접등록)
            ['favicon.ico', 'robots.txt'].forEach(filename => {
                app.use(`/${filename}`, (req, res) => {
                    res.sendFile(path_1.join(STATIC_PATH, filename));
                });
            });
            // 템플릿 폴더 및 엔진 설정
            app.set('views', TEMPLATE_PATH);
            app.set('view engine', 'ejs');
            app.engine('html', ejs.renderFile);
            /**===========================**/
            // cookie parser
            app.use(cookieParser());
            // body parser
            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));
            // --------------------------------------------
            app.use(middleware_1.CoTracker); // cotracker 미들웨어
            app.use(middleware_1.NoCacheHtml); // HTML 캐시 미적용
            app.use('/state/version', (req, res) => res.send(util_1.getVersion())); // 버전 응답
            app.use('/state/log/:type/:message', middleware_1.ErrorResponse); // 에러 로그 응답 미들웨어
            // --------------------------------------------
            // Express 글로벌 예외 처리
            app.use((err, req, res, next) => {
                if (req.originalUrl === '/favicon.ico') { // 파비콘 요청인 경우 No Contents 전송
                    return res.sendStatus(204);
                }
                res.sendStatus(500);
            });
            yield this.listen(app);
        });
    }
}
exports.BaseAppContainer = BaseAppContainer;
//# sourceMappingURL=base.app.container.js.map