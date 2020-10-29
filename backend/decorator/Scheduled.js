"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ZumDecoratorType_1 = require("./ZumDecoratorType");
/**
 * 스케줄 등록 데코레이터
 * @param ScheduleOption 스케줄 등록 옵션
 * @constructor
 */
function Scheduled(ScheduleOption) {
    return function (component, propertyKey, descriptor) {
        Reflect.defineMetadata(ZumDecoratorType_1.ZumDecoratorType.Scheduled, ScheduleOption, descriptor.value);
        return descriptor;
    };
}
exports.Scheduled = Scheduled;
//# sourceMappingURL=Scheduled.js.map