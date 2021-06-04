import {ZumDecoratorType} from "../../../backend/decorator/ZumDecoratorType";


/**
 * 커스텀 데코레이터
 *
 * @constructor
 */
export function AfterEx1() {
  function afterFunction(result, ...args) {
    if (result % 2 == 0) {
      return 'even';
    }
    return 'odd';
  }

  return function(clazz, methodName: string, descriptor: any) {
    Reflect.defineMetadata(ZumDecoratorType.CustomAfter, afterFunction, descriptor.value);
    return descriptor;
  };
}



export function AfterEx2() {

  function afterFunction(result, ...args) {
    if (result % 2 == 0) {
      return result;
    }
    return null;
  }

  return function(clazz, methodName: string, descriptor: any) {
    Reflect.defineMetadata(ZumDecoratorType.CustomAfter, afterFunction, descriptor.value);
    return descriptor;
  };
}
