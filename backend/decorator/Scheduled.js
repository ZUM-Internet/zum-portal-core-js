"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduled = void 0;
const ZumDecoratorType_1 = require("./ZumDecoratorType");
const Component_1 = require("./Component");
/**
 * 스케줄 등록 데코레이터
 * @param ScheduleOption 스케줄 등록 옵션
 * @param func
 * @constructor
 */
function Scheduled(ScheduleOption, func) {
    if (func) {
        return Component_1.appendSchedule(this, func, ScheduleOption);
    }
    return function (component, propertyKey, descriptor) {
        Reflect.defineMetadata(ZumDecoratorType_1.ZumDecoratorType.Scheduled, ScheduleOption, descriptor.value);
        return descriptor;
    };
}
exports.Scheduled = Scheduled;
//# sourceMappingURL=Scheduled.js.map