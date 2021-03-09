import * as NodeCache from "node-cache";
import {ZumDecoratorType} from "./ZumDecoratorType";
import {appendCache} from "./Component";

type CachingOptionFunction = () => CachingOption

/**
 * 글로별 영역 캐시
 *
 * 주의: 글로벌 캐시는 기간 만료시에도 데이터를 삭제하지않음
 */
export const globalCache = new NodeCache({
  deleteOnExpire: false,
});

/**
 * 캐시 메타데이터 추가
 * @param CachingOption 캐시 옵션
 * @param func
 * @constructor
 */
export function Caching(CachingOption: CachingOptionFunction | CachingOption = {}, func?: Function): Function {
  
  // 마지막 파리미터로 함수를 입력받으면 캐싱처리된 함수를 반환
  if (func) {
    return appendCache(this, func, CachingOption);
  }

  // 데코레이터 메타데이터 삽입
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
  refreshCron?: string | Function; // 자동 갱신 처리 적용시 cron 설정값. ex) '0/30 * * * * *'
  unless?: (result: any) => boolean; // 캐시 설정 여부
  runOnStart?: boolean; // 어플리케이션 기동시 자동 실행 여부
}
