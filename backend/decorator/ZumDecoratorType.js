"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZumDecoratorType = void 0;
const ZUM_CORE_DECORATOR_PREFIX = '__$zum__';
/**
 * 컨테이너에 등록할 때 사용될 타입 프리픽스
 */
exports.ZumDecoratorType = {
    PREFIX: ZUM_CORE_DECORATOR_PREFIX,
    Component: `${ZUM_CORE_DECORATOR_PREFIX}component`,
    ComponentPostConstructor: `${ZUM_CORE_DECORATOR_PREFIX}component__post_constructor`,
    Controller: `${ZUM_CORE_DECORATOR_PREFIX}controller`,
    RequestMapping: `${ZUM_CORE_DECORATOR_PREFIX}request_mapping`,
    Scheduled: `${ZUM_CORE_DECORATOR_PREFIX}scheduled`,
    Caching: `${ZUM_CORE_DECORATOR_PREFIX}caching`,
    Middleware: `${ZUM_CORE_DECORATOR_PREFIX}middleware`,
    CustomBefore: `${ZUM_CORE_DECORATOR_PREFIX}custom__before`,
    CustomAfter: `${ZUM_CORE_DECORATOR_PREFIX}custom__after`,
};
//# sourceMappingURL=ZumDecoratorType.js.map