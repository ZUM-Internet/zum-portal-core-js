import {ZumDecoratorType} from "../../../backend/decorator/ZumDecoratorType";


/**
 * 커스텀 데코레이터
 *
 * @constructor
 */
export function BeforeEx1() {

  function beforeFunction(next, ...args) {
    next('hello');
  }

  return function(clazz, methodName: string, descriptor: any) {
    Reflect.defineMetadata(ZumDecoratorType.CustomBefore, beforeFunction, descriptor.value);
    return descriptor;
  };
}



export function BeforeEx2() {

  function beforeFunction(next, ...args) {
    if (args[0] % 2 === 0) {
      next();
    }
  }

  return function(clazz, methodName: string, descriptor: any) {
    Reflect.defineMetadata(ZumDecoratorType.CustomBefore, beforeFunction, descriptor.value);
    return descriptor;
  };
}
