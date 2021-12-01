import { Request, Response } from 'express';
import { CookieOptions } from 'express-serve-static-core';

export const ABTEST_COOKIE_NAME = '_ABTEST_VARIANT';

// [variant 키]: [생성 비율(0.x ~ 1)]
type Variants = {
  [variantKey: string]: number;
};

// [테스트명]: [생성할 variant]
type ABTestRecord = {
  [testName: string]: Variants;
};

/**
 * variants 객체를 받아서 variant 비율의 확률로 랜덤하게 하나를 선택하여 해당 variant key를 반환한다
 */
export function selectVariant(variants: Variants) {
  const totalRatio = Object.values(variants).reduce((acc, cur) => acc + cur, 0);
  const seed = Math.random() * totalRatio;

  let [selectedVariantKey] = Object.keys(variants);
  let acc = 0;

  Object.entries(variants).some(([variantKey, ratio]) => {
    if (seed <= acc + ratio) {
      selectedVariantKey = variantKey;
      return true;
    }
    acc += ratio;
    return false;
  });

  return selectedVariantKey;
}

/**
 * AB테스트 대상값인 variant에 따라 테스트명별로 쿠키를 생성한다.
 *
 * @param req 미들웨어 요청
 * @param res 미들웨어 응답
 * @param testRecord {테스트명: {키: 생성 비율(0.x ~ 1)}} 형태의 값
 *        ex) {example1: { a: 0.1, b: 0.9 }}
 *        ex) {example2: { a: 0.1, b: 0.2, c: 0.3, d: 0.4 }}
 * @param cookieOptions 쿠키 설정 옵션
 */
export function putVariantCookies(
  req: Request,
  res: Response,
  testRecord: ABTestRecord,
  cookieOptions: CookieOptions = {},
): void {
  const cookies = req.cookies as Record<string, any>;
  const cookieRecord = (JSON.parse(cookies[ABTEST_COOKIE_NAME] || null) || {}) as Record<string, any>;

  // 테스트별로 쿠키 값 객체에 랜덤 생성하여 추가
  Object.entries(testRecord).forEach(([testName, variants]) => {
    // 이미 쿠키에 선언되어 있는 경우 제외
    if (cookieRecord[testName]) return;

    cookieRecord[testName] = selectVariant(variants);
  });

  // 쿠키 설정
  res.cookie(ABTEST_COOKIE_NAME, JSON.stringify(cookieRecord), {
    ...cookieOptions,
    // 추가적인 옵션은 여기에 작성
  });
}
