import {CachingOption, globalCache} from "../decorator/Caching";


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
export default function checkCacheCondition(cacheKey: string, value: any,
                                            unlessFunction: Function, CachingOption: CachingOption): any {

  const cache = CachingOption.cache || globalCache;

  if (value instanceof Promise) { // 결과가 Promise인 경우
    return new Promise(resolve => {
      const prevValue = cache.get(cacheKey);

      // 저장되어있는 캐시가 null인 경우 우선 데이터를 삽입하고 수정한다
      if (!prevValue) {
        cache.set(cacheKey,
          value.then(async v => {
            if (unlessFunction(v)) { // unless === true 일 시 캐시 제거
              cache.set(cacheKey, prevValue);
              return prevValue;
            }
            return v;
          }),
          CachingOption.ttl || 0);
      }


      value.then(async v => {
        if (!unlessFunction(v)) { // unless 함수가 없거나 false인 경우에만 저장
          cache.set(cacheKey, value, CachingOption.ttl || 0);
          return resolve(v);

        } else {
          value = cache.get(cacheKey);
          return resolve(await value);
        }
      });
    });


  } else { // 결과가 일반 값인 경우.

    if (!unlessFunction(value)) {
      cache.set(cacheKey, value, CachingOption.ttl)
    } else {
      value = cache.get(cacheKey);
    }

    return value;
  }

}

