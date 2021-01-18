"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Caching = exports.globalCache = void 0;
const NodeCache = require("node-cache");
const ZumDecoratorType_1 = require("./ZumDecoratorType");
const Component_1 = require("./Component");
/**
 * 글로별 영역 캐시
 *
 * 주의: 글로벌 캐시는 기간 만료시에도 데이터를 삭제하지않음
 */
exports.globalCache = new NodeCache({
    deleteOnExpire: false,
});
/**
 * 캐시 메타데이터 추가
 * @param CachingOption 캐시 옵션
 * @param func
 * @constructor
 */
function Caching(CachingOption = {}, func) {
    // 마지막 파리미터로 함수를 입력받으면 캐싱처리된 함수를 반환
    if (func) {
        return Component_1.appendedCache(this, func, CachingOption);
    }
    // 데코레이터 메타데이터 삽입
    return function (clazz, methodName, descriptor) {
        Reflect.defineMetadata(ZumDecoratorType_1.ZumDecoratorType.Caching, CachingOption, descriptor.value);
        return descriptor;
    };
}
exports.Caching = Caching;
//# sourceMappingURL=Caching.js.map