import {container, singleton} from "tsyringe";
import {ZumDecoratorType} from "./ZumDecoratorType";
import * as schedule from 'node-schedule';
import {globalCache} from "./Caching";
import logger from "../util/Logger";
import deepFreeze from "../functions/deepFreeze";
import checkCacheCondition from "../functions/checkCacheCondition";
import {callWithInstance} from "../functions/callWithInstance";

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
      const originalMethod = instance[methodName];
      let method = instance[methodName];

      // 스케줄 등록 및 취소 함수 추가
      appendSchedule(instance, method);

      // 커스텀 데코레이터 기능 추가
      method = appendCustomDecorator(instance, method);

      // 캐시 기능 추가 (데코레이터 추가 후 메소드가 변경되므로 원래 메소드의 메타데이터 삽입)
      const cachingMetadata = Reflect.getMetadata(ZumDecoratorType.Caching, originalMethod);
      method = appendCache(instance, method, cachingMetadata);

      instance[methodName] = method;
    }

    /**
     * post constructor와 같은 후처리 데코레이터 적용
      */
    for (let methodName of Object.getOwnPropertyNames(constructor.prototype)) {
      const method = instance[methodName];
      // post constructor 메소드 수행
      try {
        if (Reflect.getMetadata(ZumDecoratorType.ComponentPostConstructor, method)) {
          method.call(instance);
        }

      } catch (e) {
        console.error('error on post constructor', e);
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
 * @param scheduleOption
 */
export function appendSchedule(instance, method, scheduleOption?) {
  let ScheduleOption = callWithInstance(scheduleOption || Reflect.getMetadata(ZumDecoratorType.Scheduled, method), instance);
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
 * @param cachingOption
 */
export function appendCache(instance, method, cachingOption) {
  let CachingOption = callWithInstance(cachingOption, instance);
  if (!CachingOption) return method;

  const cache = CachingOption.cache || globalCache;
  const _function = method;
  const conditionFunction: Function = CachingOption.unless?.bind(instance) || (() => false);

console.log('sdfisdf', _function.toString())

  // auto refresh
  if (CachingOption?.refreshCron) {
    // 갱신 함수
    const refreshFunc = function() {
      const cacheKey = CachingOption.key || `${instance?.constructor?.name}_${method.name}_`;
      const value = _function.call(instance);
      return deepFreeze(checkCacheCondition(cacheKey, value, conditionFunction, CachingOption));
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

  return function () {
    const cacheKey: string = CachingOption.key || `${instance?.constructor?.name}_${method.name}_` + [...arguments].toString();
    const cachingValue: any = cache.get(cacheKey);

    // 캐시된 값이 있으면
    if (cachingValue) {
      return cachingValue;
    }

    // 캐시된 값이 없으면
    const value = _function.call(instance, ...arguments);
    return deepFreeze(checkCacheCondition(cacheKey, value, conditionFunction, CachingOption));
  };
}


/**
 * 커스텀 데코레이터로 설정된 함수 설치
 * @param instance
 * @param method
 */
export function appendCustomDecorator(instance, method) {
  const beforeDecoratorFunction = Reflect.getMetadata(ZumDecoratorType.CustomBefore, method)?.bind(instance);
  const afterDecoratorFunction = Reflect.getMetadata(ZumDecoratorType.CustomAfter, method)?.bind(instance);

  return function () {
    let args = [...arguments];

    // before hook
    if (beforeDecoratorFunction) {
      let next = false;
      beforeDecoratorFunction.call(instance,
                                    (...beforeResult) => {
                                      next = true;
                                      beforeResult.length ? args = [...beforeResult] : ''
                                    },
                                    ...args)
      if (!next) return;
    }

    // call original method
    let result = method.call(instance, ...args);

    // after hook
    if (afterDecoratorFunction) {
      const afterResult = afterDecoratorFunction.call(instance, result, ...args);
      if (afterResult !== undefined) return afterResult
    }

    // return original result
    return result;

  };



}





