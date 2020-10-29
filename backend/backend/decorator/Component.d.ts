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
 * 메소드의 scope를 재설정하기 위해 사용되는 함수.
 * 람다식 사용시 'this' scope가 고정되는 것을 수정하기 위해 구현
 * @param obj
 * @param instance
 */
export declare function callOptionWithInstance(obj: any, instance: any): any;
