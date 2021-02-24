import {Request, Response} from 'express';
import {CookieOptions} from "express-serve-static-core";

const ABTEST_COOKIE_NAME = '_ABTEST_VARIANT';

// [variant 키]: [생성 비율(0.x ~ 1)]
type variantValue = { [key: string]: number };

// [테스트명]: [생성할 variant]
type variant = { [testName: string]: variantValue };


/**
 * AB테스트 대상값인 variant에 따라 테스트명별로 쿠키를 생성한다.
 *
 * @param req 미들웨어 요청
 * @param res 미들웨어 응답
 * @param variant {테스트명: {키: 생성 비율(0.x ~ 1)}} 형태의 값
 * @param cookieOptions 쿠키 설정 옵션
 */
export function putVariantCookies(req: Request, res: Response, variant: variant,
                                  cookieOptions: CookieOptions = {}): void {
  const cookieValue = {};
  const cookie = JSON.parse(req.cookies[ABTEST_COOKIE_NAME] || null);

  // 테스트별로 쿠키 값 객체에 랜덤 생성하여 추가
  for (let testName in variant) {
    if (!variant.hasOwnProperty(testName)) continue;

    const variantValues = variant[testName];
    const existCookieVariant = cookie?.[testName];

    // 이미 쿠키에 선언되어 있는 경우 제외
    if (existCookieVariant && variantValues[existCookieVariant]) {
      continue;
    }

    // 랜덤하게 Variant 타깃 생성
    const total = Object.values(variantValues).reduce((acc, cur) => acc+cur, 0);
    const seed = Math.random() * total;
    let targetKey = Object.keys(variantValues)[0];
    let fixValue = 0;

    for (let key in variantValues) {
      if (!variantValues.hasOwnProperty(key)) continue;
      const value = variantValues[key];
      if (seed < fixValue + value) {
        targetKey = key;
        break;
      }
      fixValue += value;
    }

    cookieValue[testName] = targetKey;
  }


  // 쿠키 설정
  const option = Object.assign({}, cookieOptions, {});
  res.cookie(ABTEST_COOKIE_NAME, JSON.stringify(cookieValue), option);
}
