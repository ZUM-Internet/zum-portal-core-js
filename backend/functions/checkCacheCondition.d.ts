import { CachingOption } from "../decorator/Caching";
/**
 * 캐시 저장 상태를 확인하고 캐시에 저장하는 함수
 *
 * unless 함수를 입력받아 수행한 후 true인 경우 캐시에 저장한다
 *
 * @param cacheKey 캐시 키
 * @param value 체크 후 캐시에 저장할 값
 * @param unlessFunction instance가 바인딩된 값 체크 함수
 * @param CachingOption 캐시 옵션
 * @return 체크한 값
 */
export default function checkCacheCondition(cacheKey: string, value: any, unlessFunction: Function, CachingOption: CachingOption): any;
