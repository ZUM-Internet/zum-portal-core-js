"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 객체를 완전 동결하는 함수.
 * 캐시된 값을 수정하지 못하도록 하기 위해 사용한다
 *
 * @param object
 */
function deepFreeze(object) {
    if (typeof object !== 'object')
        return object;
    try {
        const propNames = Object.getOwnPropertyNames(object);
        for (let name of propNames) {
            let value = object[name];
            object[name] = value && typeof value === "object" ?
                deepFreeze(value) : value;
        }
    }
    catch (_a) {
        console.warn(`Cannot freeze object. Check cache validated`, object);
        return object;
    }
    return Object.freeze(object);
}
exports.default = deepFreeze;
//# sourceMappingURL=deepFreeze.js.map