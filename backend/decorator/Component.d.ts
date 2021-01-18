/**
 * 컴포넌트 인스턴스 생성 데코레이터
 * @constructor
 */
export declare function Component(): (constructor: any) => void;
/**
 * Post Constructor 메소드
 * @constructor
 */
export declare function PostConstructor(): (clazz: any, methodName: string, descriptor: any) => any;
/**
 * 스케줄 등록함수
 * @param instance
 * @param method
 * @param scheduleOption
 */
export declare function appendSchedule(instance: any, method: any, scheduleOption?: any): void;
/**
 * 캐시 등록함수
 * @param instance
 * @param method
 * @param cachingOption
 */
export declare function appendedCache(instance: any, method: any, cachingOption?: any): any;
