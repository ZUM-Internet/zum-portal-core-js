const ZUM_CORE_DECORATOR_PREFIX = '__$zum__';

/**
 * 컨테이너에 등록할 때 사용될 타입 프리픽스
 */
export const ZumDecoratorType = {
  PREFIX: ZUM_CORE_DECORATOR_PREFIX,
  Component: `${ZUM_CORE_DECORATOR_PREFIX}component`,
  ComponentPostConstructor: `${ZUM_CORE_DECORATOR_PREFIX}component__post_constructor`,
  Controller: `${ZUM_CORE_DECORATOR_PREFIX}controller`,
  RequestMapping: `${ZUM_CORE_DECORATOR_PREFIX}request_mapping`,
  Scheduled: `${ZUM_CORE_DECORATOR_PREFIX}scheduled`,
  Caching: `${ZUM_CORE_DECORATOR_PREFIX}caching`,
  Middleware: `${ZUM_CORE_DECORATOR_PREFIX}middleware`,
}
