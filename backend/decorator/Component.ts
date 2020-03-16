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
    for (let methodName of Object.getOwnPropertyNames(constructor.prototype)) {
      const method = instance[methodName];

      // 스케줄 등록 및 취소 함수 추가
      appendSchedule(instance, method);
      // 캐시 기능 추가
      appendCache(instance, method);
    }

  }
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
  let conditionFunction: Function;
  if (ScheduleOption.condition !== undefined) {
    conditionFunction = ScheduleOption.condition.bind
                        ? ScheduleOption.condition.bind(instance) : () => ScheduleOption.condition; 
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

  const _function = method;
  const conditionFunction: Function = CachingOption.unless?.bind(instance) || (() => true);
  instance[method.name] = function () {
    const cacheKey: string = CachingOption.key || `${instance.constructor.name}_${method.name}_` + [...arguments].toString();
    const cachingValue: any = globalCache.get(cacheKey);

    // 캐시된 값이 있으면
    if (cachingValue) {
      return cachingValue;
    }

    // 캐시된 값이 없으면
    const value = _function.call(instance, ...arguments) || `${ZumDecoratorType.PREFIX}${instance.constructor.name}_${_function.name}`;
    return checkCondition(cacheKey, value, conditionFunction, CachingOption);
  };

  // auto refresh
  if (CachingOption?.refreshCron) {
    // 갱신 함수
    const refreshFunc = function() {
      const cacheKey = CachingOption.key || `${instance.constructor.name}_${method.name}_`;
      const value = _function.call(instance);
      return checkCondition(cacheKey, value, conditionFunction, CachingOption);
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
 */
function checkCondition(cacheKey: string, value: any,
                        unlessFunction: Function, CachingOption: CachingOption) {

  if (value instanceof Promise) { // 결과가 Promise인 경우

    value.then(v => {
      if (!unlessFunction(v)) { // unless 함수가 false인 경우에만 저장
        globalCache.set(cacheKey, value, CachingOption.ttl || 0)
      } else {
        value = globalCache.get(cacheKey)
      }
    });

  } else { // 결과가 일반 값인 경우.

    if (unlessFunction(value)) {
      globalCache.set(cacheKey, value, CachingOption.ttl)
    } else {
      value = globalCache.get(cacheKey);
    }

  }

  return value;
}

/**
 *
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
