import * as NodeCache from "node-cache";
declare type CachingOptionFunction = () => CachingOption;
/**
 * 글로별 영역 캐시
 */
export declare const globalCache: NodeCache;
/**
 * 캐시 메타데이터 추가
 * @param CachingOption 캐시 옵션
 * @constructor
 */
export declare function Caching(CachingOption?: CachingOptionFunction | CachingOption): (clazz: any, methodName: string, descriptor: any) => any;
/**
 * 캐시 데코레이터 옵션
 */
export interface CachingOption {
    cache?: NodeCache;
    key?: string;
    ttl?: number;
    refreshCron?: string | Function;
    unless?: (result: any) => boolean;
    runOnStart?: boolean;
}
export {};
