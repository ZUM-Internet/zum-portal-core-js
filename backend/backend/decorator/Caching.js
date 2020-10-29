"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeCache = require("node-cache");
const ZumDecoratorType_1 = require("./ZumDecoratorType");
/**
 * 글로별 영역 캐시
 */
exports.globalCache = new NodeCache({
    deleteOnExpire: false,
});
/**
 * 캐시 메타데이터 추가
 * @param CachingOption 캐시 옵션
 * @constructor
 */
function Caching(CachingOption = {}) {
    return function (clazz, methodName, descriptor) {
        Reflect.defineMetadata(ZumDecoratorType_1.ZumDecoratorType.Caching, CachingOption, descriptor.value);
        return descriptor;
    };
}
exports.Caching = Caching;
//# sourceMappingURL=Caching.js.map