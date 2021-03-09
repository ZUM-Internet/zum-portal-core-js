import {ZumDecoratorType} from "./ZumDecoratorType";
import {NextFunction, Request, RequestHandler, Response} from "express";


type FunctionHandler = () => RequestHandler;
type FunctionHandlerArray = () => RequestHandler[];

/**
 * 미들웨어 등록 데코레이터
 * @param middleware
 * @constructor
 */
export function Middleware(middleware: RequestHandler | RequestHandler[]
                                     | FunctionHandler | FunctionHandlerArray): any {
  return function (component, propertyKey?: string, descriptor?: PropertyDescriptor) {

    // 메소드 데코레이터인 경우(descriptor) 메소드 반환
    if (descriptor) {
      Reflect.defineMetadata(ZumDecoratorType.Middleware, middleware, descriptor.value);
      return descriptor
    }

    // 클래스 데코레이터인 경우 클래스에 메타 데이터 추가
    Reflect.defineMetadata(ZumDecoratorType.Middleware, middleware, component);

  }
}
