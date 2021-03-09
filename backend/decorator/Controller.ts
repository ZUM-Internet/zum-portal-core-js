import * as express from 'express';
import {NextFunction, Request, Response} from 'express';
import {container, singleton} from "tsyringe";
import {ZumDecoratorType} from "./ZumDecoratorType";
import logger from "../util/Logger";
import {_getYmlToken} from "./Yml";
import {callWithInstance} from "../functions/callWithInstance";

// 더 긴 URL부터 핸들링하기 위해 사용되는 Map 객체
const urlInstaller: Array<{[url: string]: Function}> = [];

/**
 * 컨트롤러 데코레이터
 * @param ControllerOption 컨트롤러 데코레이터 옵션
 * @constructor
 */
export function Controller(ControllerOption: ControllerOption = {path: '/'}) {
  return function (constructor) {
    Reflect.defineMetadata(ZumDecoratorType.Component, constructor.name, constructor);
    Reflect.defineMetadata(ZumDecoratorType.Controller, constructor.name, constructor);
    singleton()(constructor);

    // @ts-ignore
    const app = container.resolve(express);

    // 컨트롤러 객체 획득
    const instance = container.resolve(constructor);


    // application.yml의 public path 획득
    // @ts-ignore
    const publicPath = container.resolve(_getYmlToken('application'))?.publicPath || '';

    // 메소드명 획득, 메소드의 메타 데이터를 이용하여 라우팅
    for (let methodName of Object.getOwnPropertyNames(constructor.prototype)) {
      const method = instance[methodName];
      const requestMappingMeta = Reflect.getMetadata(ZumDecoratorType.RequestMapping, method);
      let middleware = Reflect.getMetadata(ZumDecoratorType.Middleware, method);
      const constructorMiddleware = Reflect.getMetadata(ZumDecoratorType.Middleware, constructor);
      if (!requestMappingMeta) continue;

      // 함수형 미들웨어 정리
      if (Array.isArray(middleware)) {
        middleware = middleware.map(m => callWithInstance(m, instance));
        middleware = [constructorMiddleware, ...middleware].filter(t => t);
      } else {
        middleware = callWithInstance(middleware, instance);
        middleware = [constructorMiddleware, middleware].filter(t => t);
      }


      // 메타 데이터 destruct
      const {path, requestType} = requestMappingMeta;

      // 컨트롤러 path 획득.
      const requestPaths = path.forEach ? path : [path];

      // 라우터 등록
      requestPaths.forEach(requestPath => {
        const routePath = (publicPath + ControllerOption.path + requestPath)
                          .replace(/\/\//gi, '/'); // `//` 형식 제거


        // URL 핸들러를 intaller에 등록. 등록된 URL 핸들러는 BaseAppContainer에서 마지막에 실행한다
        if (middleware) {
          urlInstaller.push({[routePath]: () => app[requestType](routePath, ...middleware, method.bind(app, instance))});

        } else {
          urlInstaller.push({[routePath]: () => app[requestType](routePath, method.bind(app, instance))});
        }


      });
    }

  }
}

/**
 * 더 긴 URL부터 핸들링해야 정상 작동하므로 소팅한 후 Express App에 등록한다
 */
export function urlInstall() {
  urlInstaller
    .sort((l, r) => Object.keys(r)[0].length - Object.keys(l)[0].length)
    .sort((l, r) => Object.keys(l)[0].includes('*') ? 1 : -1)
    .sort((l, r) => Object.keys(l)[0].includes('/api') ? -1 : 1)
    .forEach(obj => (Object.values(obj)[0])());
}


/**
 * Get 메소드 매핑 데코레이터
 * @param RequestOption 리퀘스트 매핑 옵션
 * @constructor
 */
export function GetMapping(RequestOption: RequestOption) {
  return RequestMapping('get', RequestOption);
}

/**
 * Post 메소드 매핑 데코레이터
 * @param RequestOption 리퀘스트 매핑 옵션
 * @constructor
 */
export function PostMapping(RequestOption: RequestOption) {
  return RequestMapping('post', RequestOption);
}

/**
 * Put 메소드 매핑 데코레이터
 * @param RequestOption 리퀘스트 매핑 옵션
 * @constructor
 */
export function PutMapping(RequestOption: RequestOption) {
  return RequestMapping('put', RequestOption);
}

/**
 * Delete 메소드 매핑 데코레이터
 * @param RequestOption 리퀘스트 매핑 옵션
 * @constructor
 */
export function DeleteMapping(RequestOption: RequestOption) {
  return RequestMapping('delete', RequestOption);
}


/**
 * 라우터 함수를 래핑하는 함수
 *
 * @param requestType 요청 타입 [GET, POST ...]
 * @param requestOption 요청 옵션 객체
 * @constructor
 */
function RequestMapping(requestType: string, requestOption: RequestOption) {
  return function (controllerClazz, methodName, descriptor) {


    if (requestOption.stub && process.env.ZUM_BACK_MODE === 'publish') { // publish 모드이며 stub 데이터 설정한 경우
      descriptor.value = function (context: any, req: Request, res: Response, next: NextFunction) {
        const func = requestOption.stub[requestType];
        return res.send(
          func ? func.call(context, req) // stub 데이터가 함수 형태인 경우 실행
                     : requestOption.stub // json 형태인 경우 그대로 반환
        );
      }

    } else { // 일반 라우팅의 경우
      const func = descriptor.value;

      // 래핑된 라우터 함수 적용
      descriptor.value = function (context: any, req: Request, res: Response, next: NextFunction) {
        try {
          func.call(context, req, res, next);
        } catch (err) {
          logger.error(err);
          next();
        }
      };

    }


    // 메타데이터 삽입
    const meta: object = Object.assign({}, requestOption);
    meta['requestType'] = requestType;
    Reflect.defineMetadata(ZumDecoratorType.RequestMapping, meta, descriptor.value);

    return descriptor;
  };
}


/**
 * 컨트롤러 옵션
 */
interface ControllerOption {
  path: string; // 컨트롤러 path
}

/**
 * 리퀘스트 옵션
 */
interface RequestOption {
  path: string | Array<string>; // 매핑할 URL Path
  stub?: object; // publish 모드에서 리턴할 stub 객체
}
