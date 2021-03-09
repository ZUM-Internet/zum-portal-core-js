"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMapping = exports.PutMapping = exports.PostMapping = exports.GetMapping = exports.urlInstall = exports.Controller = void 0;
const express = require("express");
const tsyringe_1 = require("tsyringe");
const ZumDecoratorType_1 = require("./ZumDecoratorType");
const Logger_1 = require("../util/Logger");
const Yml_1 = require("./Yml");
const callWithInstance_1 = require("../functions/callWithInstance");
// 더 긴 URL부터 핸들링하기 위해 사용되는 Map 객체
const urlInstaller = [];
/**
 * 컨트롤러 데코레이터
 * @param ControllerOption 컨트롤러 데코레이터 옵션
 * @constructor
 */
function Controller(ControllerOption = { path: '/' }) {
    return function (constructor) {
        var _a;
        Reflect.defineMetadata(ZumDecoratorType_1.ZumDecoratorType.Component, constructor.name, constructor);
        Reflect.defineMetadata(ZumDecoratorType_1.ZumDecoratorType.Controller, constructor.name, constructor);
        tsyringe_1.singleton()(constructor);
        // @ts-ignore
        const app = tsyringe_1.container.resolve(express);
        // 컨트롤러 객체 획득
        const instance = tsyringe_1.container.resolve(constructor);
        // application.yml의 public path 획득
        // @ts-ignore
        const publicPath = ((_a = tsyringe_1.container.resolve(Yml_1._getYmlToken('application'))) === null || _a === void 0 ? void 0 : _a.publicPath) || '';
        // 메소드명 획득, 메소드의 메타 데이터를 이용하여 라우팅
        for (let methodName of Object.getOwnPropertyNames(constructor.prototype)) {
            const method = instance[methodName];
            const requestMappingMeta = Reflect.getMetadata(ZumDecoratorType_1.ZumDecoratorType.RequestMapping, method);
            let middleware = Reflect.getMetadata(ZumDecoratorType_1.ZumDecoratorType.Middleware, method);
            const constructorMiddleware = Reflect.getMetadata(ZumDecoratorType_1.ZumDecoratorType.Middleware, constructor);
            if (!requestMappingMeta)
                continue;
            // 함수형 미들웨어 정리
            if (Array.isArray(middleware)) {
                middleware = middleware.map(m => callWithInstance_1.callWithInstance(m, instance));
                middleware = [constructorMiddleware, ...middleware].filter(t => t);
            }
            else {
                middleware = callWithInstance_1.callWithInstance(middleware, instance);
                middleware = [constructorMiddleware, middleware].filter(t => t);
            }
            // 메타 데이터 destruct
            const { path, requestType } = requestMappingMeta;
            // 컨트롤러 path 획득.
            const requestPaths = path.forEach ? path : [path];
            // 라우터 등록
            requestPaths.forEach(requestPath => {
                const routePath = (publicPath + ControllerOption.path + requestPath)
                    .replace(/\/\//gi, '/'); // `//` 형식 제거
                // URL 핸들러를 intaller에 등록. 등록된 URL 핸들러는 BaseAppContainer에서 마지막에 실행한다
                if (middleware) {
                    urlInstaller.push({ [routePath]: () => app[requestType](routePath, ...middleware, method.bind(app, instance)) });
                }
                else {
                    urlInstaller.push({ [routePath]: () => app[requestType](routePath, method.bind(app, instance)) });
                }
            });
        }
    };
}
exports.Controller = Controller;
/**
 * 더 긴 URL부터 핸들링해야 정상 작동하므로 소팅한 후 Express App에 등록한다
 */
function urlInstall() {
    urlInstaller
        .sort((l, r) => Object.keys(r)[0].length - Object.keys(l)[0].length)
        .sort((l, r) => Object.keys(l)[0].includes('*') ? 1 : -1)
        .sort((l, r) => Object.keys(l)[0].includes('/api') ? -1 : 1)
        .forEach(obj => (Object.values(obj)[0])());
}
exports.urlInstall = urlInstall;
/**
 * Get 메소드 매핑 데코레이터
 * @param RequestOption 리퀘스트 매핑 옵션
 * @constructor
 */
function GetMapping(RequestOption) {
    return RequestMapping('get', RequestOption);
}
exports.GetMapping = GetMapping;
/**
 * Post 메소드 매핑 데코레이터
 * @param RequestOption 리퀘스트 매핑 옵션
 * @constructor
 */
function PostMapping(RequestOption) {
    return RequestMapping('post', RequestOption);
}
exports.PostMapping = PostMapping;
/**
 * Put 메소드 매핑 데코레이터
 * @param RequestOption 리퀘스트 매핑 옵션
 * @constructor
 */
function PutMapping(RequestOption) {
    return RequestMapping('put', RequestOption);
}
exports.PutMapping = PutMapping;
/**
 * Delete 메소드 매핑 데코레이터
 * @param RequestOption 리퀘스트 매핑 옵션
 * @constructor
 */
function DeleteMapping(RequestOption) {
    return RequestMapping('delete', RequestOption);
}
exports.DeleteMapping = DeleteMapping;
/**
 * 라우터 함수를 래핑하는 함수
 *
 * @param requestType 요청 타입 [GET, POST ...]
 * @param requestOption 요청 옵션 객체
 * @constructor
 */
function RequestMapping(requestType, requestOption) {
    return function (controllerClazz, methodName, descriptor) {
        if (requestOption.stub && process.env.ZUM_BACK_MODE === 'publish') { // publish 모드이며 stub 데이터 설정한 경우
            descriptor.value = function (context, req, res, next) {
                const func = requestOption.stub[requestType];
                return res.send(func ? func.call(context, req) // stub 데이터가 함수 형태인 경우 실행
                    : requestOption.stub // json 형태인 경우 그대로 반환
                );
            };
        }
        else { // 일반 라우팅의 경우
            const func = descriptor.value;
            // 래핑된 라우터 함수 적용
            descriptor.value = function (context, req, res, next) {
                try {
                    func.call(context, req, res, next);
                }
                catch (err) {
                    Logger_1.default.error(err);
                    next();
                }
            };
        }
        // 메타데이터 삽입
        const meta = Object.assign({}, requestOption);
        meta['requestType'] = requestType;
        Reflect.defineMetadata(ZumDecoratorType_1.ZumDecoratorType.RequestMapping, meta, descriptor.value);
        return descriptor;
    };
}
//# sourceMappingURL=Controller.js.map