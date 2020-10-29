"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ZumDecoratorType_1 = require("./ZumDecoratorType");
/**
 * 스케줄 등록 데코레이터
 * @param middleware
 * @constructor
 */
function Middleware(middleware) {
    return function (component, propertyKey, descriptor) {
        // 메소드 데코레이터인 경우(descriptor) 메소드 반환
        if (descriptor) {
            Reflect.defineMetadata(ZumDecoratorType_1.ZumDecoratorType.Middleware, middleware, descriptor.value);
            return descriptor;
        }
        // 클래스 데코레이터인 경우 클래스에 메타 데이터 추가
        Reflect.defineMetadata(ZumDecoratorType_1.ZumDecoratorType.Middleware, middleware, component);
    };
}
exports.Middleware = Middleware;
//# sourceMappingURL=Middleware.js.map