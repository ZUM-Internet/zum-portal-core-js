import { Request, Response } from 'express';
import { CookieOptions } from 'express-serve-static-core';

const ABTEST_COOKIE_NAME = '_ABTEST_VARIANT';

// [variant 키]: [생성 비율(0.x ~ 1)]
type VariantValue = {
  [key: string]: number;
};

// [테스트명]: [생성할 variant]
type Variant = {
  [testName: string]: VariantValue;
};

/**
 * AB테스트 대상값인 variant에 따라 테스트명별로 쿠키를 생성한다.
 *
 * @param req 미들웨어 요청
 * @param res 미들웨어 응답
 * @param variant {테스트명: {키: 생성 비율(0.x ~ 1)}} 형태의 값
 *        ex) {example1: { a: 0.1, b: 0.9 }}
 *        ex) {example2: { a: 0.1, b: 0.2, c: 0.3, d: 0.4` }}
 * @param cookieOptions 쿠키 설정 옵션
 */
export function putVariantCookies(
  req: Request,
  res: Response,
  variant: Variant,
  cookieOptions: CookieOptions = {},
): void {
  const cookies = req.cookies as Record<string, any>;
  const cookieValue = (JSON.parse(cookies[ABTEST_COOKIE_NAME] || null) || {}) as Record<string, any>;

  // 테스트별로 쿠키 값 객체에 랜덤 생성하여 추가
  Object.entries(variant).forEach(([testName, variantValues]) => {
    // 이미 쿠키에 선언되어 있는 경우 제외
    if (cookieValue?.[testName]) return;

    // 랜덤하게 Variant 타깃 생성
    const total = Object.values(variantValues).reduce((acc, cur) => acc + cur, 0);
    const seed = Math.random() * total;

    let targetKey = Object.keys(variantValues)[0];
    let fixValue = 0;

    Object.entries(variantValues).some(([key, value]) => {
      if (seed <= fixValue + value) {
        targetKey = key;
        return true;
      }
      fixValue += value;
      return false;
    });
    cookieValue[testName] = targetKey;
  });

  // 쿠키 설정
  res.cookie(ABTEST_COOKIE_NAME, JSON.stringify(cookieValue), {
    ...cookieOptions,
    // 추가적인 옵션은 여기에 작성
  });
}
