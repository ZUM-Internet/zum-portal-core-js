"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callWithInstance = void 0;
/**
 * 람다(Arrow Function)과 같이 Scope가 함수에 바인딩 되어있는 경우 Scope를 재설정하기 위해 사용하는 함수
 *
 * 이 함수를 이용해 실행시 함수에 사용시 고정되어있는 'this' scope를 해제하고 재실행한다.
 *
 * @param func
 * @param instance
 * @param args
 */
function callWithInstance(func, instance) {
    if (func === null || func === void 0 ? void 0 : func.call) {
        (function () { func = eval(func.toString())(); }).call(instance);
    }
    return func;
}
exports.callWithInstance = callWithInstance;
//# sourceMappingURL=callWithInstance.js.map