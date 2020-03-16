import * as NodeCache from "node-cache";
import {ZumDecoratorType} from "./ZumDecoratorType";

type CachingOptionFunction = () => CachingOption

/**
 * 글로별 영역 캐시
 */
export const globalCache = new NodeCache({
  deleteOnExpire: false,
});

/**
 * 캐시 메타데이터 추가
 * @param CachingOption 캐시 옵션
 * @constructor
 */
export function Caching(CachingOption: CachingOptionFunction | CachingOption = {}) {
  return function(clazz, methodName: string, descriptor: any) {
    Reflect.defineMetadata(ZumDecoratorType.Caching, CachingOption, descriptor.value);
    return descriptor;
  };
}


/**
 * 캐시 데코레이터 옵션
 */
export interface CachingOption {
  cache?: NodeCache; // 캐시 지정
  key?: string; // 키 지정
  ttl?: number; // 캐시 만료 시간 (초)
  refreshCron?: string | Function; // 자동 갱신 처리 적용시 cron 설정값
  unless?: (result: any) => boolean; // 캐시 설정 여부
  runOnStart?: boolean; // 어플리케이션 기동시 자동 실행 여부
}
