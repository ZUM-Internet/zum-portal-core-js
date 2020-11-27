import {container, singleton} from "tsyringe";
import {ZumDecoratorType} from "./ZumDecoratorType";
import * as schedule from 'node-schedule';
import {CachingOption, globalCache} from "./Caching";
import logger from "../util/Logger";

/**
 * 컴포넌트 인스턴스 생성 데코레이터
 * @constructor
 */
export function Component() {
  return function (constructor) {
    singleton()(constructor);
    const instance = container.resolve(constructor);

    /**
     * schedule, cache와 같은 선처리 데코레이터 적용
     */
    for (let methodName of Object.getOwnPropertyNames(constructor.prototype)) {
      const method = instance[methodName];

      // 스케줄 등록 및 취소 함수 추가
      appendSchedule(instance, method);
      // 캐시 기능 추가
      appendCache(instance, method);
    }

    /**
     * post constructor와 같은 후처리 데코레이터 적용
      */
    for (let methodName of Object.getOwnPropertyNames(constructor.prototype)) {
      const method = instance[methodName];
      // post constructor 메소드 수행
      if (Reflect.getMetadata(ZumDecoratorType.ComponentPostConstructor, method)) {
        method.call(instance);
      }
    }

  }
}

/**
 * Post Constructor 메소드
 * @constructor
 */
export function PostConstructor() {
  return function(clazz, methodName: string, descriptor: any) {
    Reflect.defineMetadata(ZumDecoratorType.ComponentPostConstructor, true, descriptor.value);
    return descriptor;
  };
}


/**
 * 스케줄 등록함수
 * @param instance
 * @param method
 */
function appendSchedule(instance, method) {
  let ScheduleOption = callOptionWithInstance(Reflect.getMetadata(ZumDecoratorType.Scheduled, method), instance);
  if (!ScheduleOption) return;

  // 스케줄러 컨디션 함수 생성
  const condition = ScheduleOption.condition;
  let conditionFunction: Function;
  if (condition !== undefined) {
    conditionFunction = condition.bind ? condition.bind(instance) : () => ScheduleOption.condition;
  } else {
    conditionFunction = () => conditionFunction;
  }
  
  const _method = function () {
    if (conditionFunction()) { // 스케줄 컨디션 확인 후 실행
      method.call(instance, ...arguments);
    }
  };
  
  const job = schedule.scheduleJob(ScheduleOption.cron, _method);
  method[ScheduleOption.cancel || 'cancel'] = function () {
    try {
      job.cancel();
    } catch (e) {
      logger.error(e);
    }
  };

  // 기본 실행
  if (ScheduleOption.runOnStart !== false) {
    _method();
  }
}


/**
 * 캐시 등록함수
 * @param instance
 * @param method
 */
function appendCache(instance, method) {
  let CachingOption = callOptionWithInstance(Reflect.getMetadata(ZumDecoratorType.Caching, method), instance);
  if (!CachingOption) return;

  const cache = CachingOption.cache || globalCache;
  const _function = method;
  const conditionFunction: Function = CachingOption.unless?.bind(instance) || (() => false);
  instance[method.name] = function () {
    const cacheKey: string = CachingOption.key || `${instance.constructor.name}_${method.name}_` + [...arguments].toString();
    const cachingValue: any = cache.get(cacheKey);

    // 캐시된 값이 있으면
    if (cachingValue) {
      return deepFreeze(cachingValue);
    }

    // 캐시된 값이 없으면
    const value = _function.call(instance, ...arguments) || `${ZumDecoratorType.PREFIX}${instance.constructor.name}_${_function.name}`;
    return deepFreeze(checkCondition(cacheKey, value, conditionFunction, CachingOption));
  };

  // auto refresh
  if (CachingOption?.refreshCron) {
    // 갱신 함수
    const refreshFunc = function() {
      const cacheKey = CachingOption.key || `${instance.constructor.name}_${method.name}_`;
      const value = _function.call(instance);
      return deepFreeze(checkCondition(cacheKey, value, conditionFunction, CachingOption));
    };

    // cron 값 설정
    let refreshCron = CachingOption.refreshCron;
    if (CachingOption.refreshCron.call) {
      (function () { refreshCron = eval(CachingOption.refreshCron.toString())(); }).call(instance);
    }
    schedule.scheduleJob(CachingOption.refreshCron, refreshFunc);

    // 기본실행
    if (CachingOption.runOnStart !== false) {
      refreshFunc();
    }
  }
}



/**
 * unless 함수를 입력받아 수행하고 true인 경우 캐시에 저장하는 함수
 *
 * @param cacheKey 캐시 키
 * @param value 체크 후 캐시에 저장할 값
 * @param unlessFunction instance가 바인딩된 값 체크 함수
 * @param CachingOption 캐시 옵션
 * @return 체크한 값
 */
function checkCondition(cacheKey: string, value: any,
                        unlessFunction: Function, CachingOption: CachingOption): any {

  const cache = CachingOption.cache || globalCache;

  if (value instanceof Promise) { // 결과가 Promise인 경우
    return new Promise(resolve => {

      // 저장되어있는 캐시가 null인 경우 우선 데이터를 삽입하고 수정한다
      if (!cache.get(cacheKey)) {
        cache.set(cacheKey,
          value.then(async v => {
            if (unlessFunction(v)) { // unless === true 일 시 캐시 제거
              cache.set(cacheKey, null);
              return null;
            }
            return v;
          }),
          CachingOption.ttl || 0);
      }


      value.then(async v => {
        if (!unlessFunction(v)) { // unless 함수가 없거나 false인 경우에만 저장
          cache.set(cacheKey, value, CachingOption.ttl || 0);
          return resolve(v);

        } else {
          value = cache.get(cacheKey);
          return resolve(await value);
        }
      });
    });


  } else { // 결과가 일반 값인 경우.

    if (!unlessFunction(value)) {
      cache.set(cacheKey, value, CachingOption.ttl)
    } else {
      value = cache.get(cacheKey);
    }

    return value;
  }

}





/**
 * 메소드의 scope를 재설정하기 위해 사용되는 함수.
 * 람다식 사용시 'this' scope가 고정되는 것을 수정하기 위해 구현
 * @param obj
 * @param instance
 */
export function callOptionWithInstance(obj, instance) {
  // cron 값 설정
  if (obj?.call) {
    (function () { obj = eval(obj.toString())(); }).call(instance);
  }
  return obj;
}


/**
 * 객체를 완전 동결하는 함수.
 * 캐시된 값을 수정하지 못하도록 하기 위해 사용한다
 * 
 * @param object
 */
function deepFreeze(object) {
  if (typeof object !== 'object') return object;

  const propNames = Object.getOwnPropertyNames(object);
  for (let name of propNames) {
    let value = object[name];
    object[name] = value && typeof value === "object" ?
      deepFreeze(value) : value;
  }
  return Object.freeze(object);
}
