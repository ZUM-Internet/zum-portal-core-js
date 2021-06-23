"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Caching_1 = require("../decorator/Caching");
/**
 * 캐시 저장 상태를 확인하고 캐시에 저장하는 함수
 *
 * unless 함수를 입력받아 수행한 후 true인 경우 캐시에 저장한다
 *
 * @param cacheKey 캐시 키
 * @param value 체크 후 캐시에 저장할 값
 * @param unlessFunction instance가 바인딩된 값 체크 함수
 * @param CachingOption 캐시 옵션
 * @return 체크한 값
 */
function checkCacheCondition(cacheKey, value, unlessFunction, CachingOption) {
    const cache = CachingOption.cache || Caching_1.globalCache;
    if (value instanceof Promise) { // 결과가 Promise인 경우
        return new Promise(resolve => {
            // 저장되어있는 캐시가 null인 경우 우선 데이터를 삽입하고 수정한다
            if (!cache.get(cacheKey)) {
                cache.set(cacheKey, value.then((v) => __awaiter(this, void 0, void 0, function* () {
                    if (unlessFunction(v)) { // unless === true 일 시 캐시 제거
                        cache.set(cacheKey, null);
                        return null;
                    }
                    return v;
                })), CachingOption.ttl || 0);
            }
            value.then((v) => __awaiter(this, void 0, void 0, function* () {
                if (!unlessFunction(v)) { // unless 함수가 없거나 false인 경우에만 저장
                    cache.set(cacheKey, value, CachingOption.ttl || 0);
                    return resolve(v);
                }
                else {
                    value = cache.get(cacheKey);
                    return resolve(yield value);
                }
            }));
        });
    }
    else { // 결과가 일반 값인 경우.
        if (!unlessFunction(value)) {
            cache.set(cacheKey, value, CachingOption.ttl);
        }
        else {
            value = cache.get(cacheKey);
        }
        return value;
    }
}
exports.default = checkCacheCondition;
//# sourceMappingURL=checkCacheCondition.js.map