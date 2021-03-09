"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendCustomDecorator = exports.appendCache = exports.appendSchedule = exports.PostConstructor = exports.Component = void 0;
const tsyringe_1 = require("tsyringe");
const ZumDecoratorType_1 = require("./ZumDecoratorType");
const schedule = require("node-schedule");
const Caching_1 = require("./Caching");
const Logger_1 = require("../util/Logger");
const deepFreeze_1 = require("../functions/deepFreeze");
const checkCacheCondition_1 = require("../functions/checkCacheCondition");
const callWithInstance_1 = require("../functions/callWithInstance");
/**
 * 컴포넌트 인스턴스 생성 데코레이터
 * @constructor
 */
function Component() {
    return function (constructor) {
        tsyringe_1.singleton()(constructor);
        const instance = tsyringe_1.container.resolve(constructor);
        /**
         * schedule, cache와 같은 선처리 데코레이터 적용
         */
        for (let methodName of Object.getOwnPropertyNames(constructor.prototype)) {
            const method = instance[methodName];
            // 스케줄 등록 및 취소 함수 추가
            appendSchedule(instance, method);
            // 캐시 기능 추가
            instance[method.name] = appendCache(instance, method);
            // 커스텀 데코레이터 기능 추가
            instance[method.name] = appendCustomDecorator(instance, method);
        }
        /**
         * post constructor와 같은 후처리 데코레이터 적용
          */
        for (let methodName of Object.getOwnPropertyNames(constructor.prototype)) {
            const method = instance[methodName];
            // post constructor 메소드 수행
            try {
                if (Reflect.getMetadata(ZumDecoratorType_1.ZumDecoratorType.ComponentPostConstructor, method)) {
                    method.call(instance);
                }
            }
            catch (e) {
                console.error('error on post constructor', e);
            }
        }
    };
}
exports.Component = Component;
/**
 * Post Constructor 메소드
 * @constructor
 */
function PostConstructor() {
    return function (clazz, methodName, descriptor) {
        Reflect.defineMetadata(ZumDecoratorType_1.ZumDecoratorType.ComponentPostConstructor, true, descriptor.value);
        return descriptor;
    };
}
exports.PostConstructor = PostConstructor;
/**
 * 스케줄 등록함수
 * @param instance
 * @param method
 * @param scheduleOption
 */
function appendSchedule(instance, method, scheduleOption) {
    let ScheduleOption = callWithInstance_1.callWithInstance(scheduleOption || Reflect.getMetadata(ZumDecoratorType_1.ZumDecoratorType.Scheduled, method), instance);
    if (!ScheduleOption)
        return;
    // 스케줄러 컨디션 함수 생성
    const condition = ScheduleOption.condition;
    let conditionFunction;
    if (condition !== undefined) {
        conditionFunction = condition.bind ? condition.bind(instance) : () => ScheduleOption.condition;
    }
    else {
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
        }
        catch (e) {
            Logger_1.default.error(e);
        }
    };
    // 기본 실행
    if (ScheduleOption.runOnStart !== false) {
        _method();
    }
}
exports.appendSchedule = appendSchedule;
/**
 * 캐시 등록함수
 * @param instance
 * @param method
 * @param cachingOption
 */
function appendCache(instance, method, cachingOption) {
    var _a;
    let CachingOption = callWithInstance_1.callWithInstance(cachingOption || Reflect.getMetadata(ZumDecoratorType_1.ZumDecoratorType.Caching, method), instance);
    if (!CachingOption)
        return method;
    const cache = CachingOption.cache || Caching_1.globalCache;
    const _function = method;
    const conditionFunction = ((_a = CachingOption.unless) === null || _a === void 0 ? void 0 : _a.bind(instance)) || (() => false);
    // auto refresh
    if (CachingOption === null || CachingOption === void 0 ? void 0 : CachingOption.refreshCron) {
        // 갱신 함수
        const refreshFunc = function () {
            var _a;
            const cacheKey = CachingOption.key || `${(_a = instance === null || instance === void 0 ? void 0 : instance.constructor) === null || _a === void 0 ? void 0 : _a.name}_${method.name}_`;
            const value = _function.call(instance);
            return deepFreeze_1.default(checkCacheCondition_1.default(cacheKey, value, conditionFunction, CachingOption));
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
        var _a;
        const cacheKey = CachingOption.key || `${(_a = instance === null || instance === void 0 ? void 0 : instance.constructor) === null || _a === void 0 ? void 0 : _a.name}_${method.name}_` + [...arguments].toString();
        const cachingValue = cache.get(cacheKey);
        // 캐시된 값이 있으면
        if (cachingValue) {
            return deepFreeze_1.default(cachingValue);
        }
        // 캐시된 값이 없으면
        const value = _function.call(instance, ...arguments);
        return deepFreeze_1.default(checkCacheCondition_1.default(cacheKey, value, conditionFunction, CachingOption));
    };
}
exports.appendCache = appendCache;
/**
 * 커스텀 데코레이터로 설정된 함수 설치
 * @param instance
 * @param method
 */
function appendCustomDecorator(instance, method) {
    var _a, _b;
    const beforeDecoratorFunction = (_a = Reflect.getMetadata(ZumDecoratorType_1.ZumDecoratorType.CustomBefore, method)) === null || _a === void 0 ? void 0 : _a.bind(instance);
    const afterDecoratorFunction = (_b = Reflect.getMetadata(ZumDecoratorType_1.ZumDecoratorType.CustomAfter, method)) === null || _b === void 0 ? void 0 : _b.bind(instance);
    return function () {
        let args = [...arguments];
        // before hook
        if (beforeDecoratorFunction) {
            let next = false;
            beforeDecoratorFunction.call(instance, (...beforeResult) => {
                next = true;
                beforeResult.length ? args = [...beforeResult] : '';
            }, ...args);
            if (!next)
                return;
        }
        // call original method
        let result = method.call(instance, ...args);
        // after hook
        if (afterDecoratorFunction) {
            const afterResult = afterDecoratorFunction.call(instance, result, ...args);
            if (afterResult !== undefined)
                return afterResult;
        }
        // return original result
        return result;
    };
}
exports.appendCustomDecorator = appendCustomDecorator;
//# sourceMappingURL=Component.js.map