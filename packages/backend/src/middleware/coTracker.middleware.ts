import { NextFunction, Request, Response } from 'express';

// 쿠키 기본 옵션
const COOKIE_OPTION = {
  domain: 'zum.com',
  maxAge: 60 * 60 * 24 * 3650,
  path: '/',
};

// cocode, couid validate 함수
const validate = (cocode: string | string[], couid: string | string[]) =>
  !Array.isArray(cocode) && !Array.isArray(couid) && couid && cocode && cocode.length >= 4;

/**
 * 동원 책임님이 만드신 CoTracker 노드 버전.
 * 사용자 추적을 위해 사용된다.
 *
 * @link {https://git.zuminternet.com/zum-portal-framework/zum-portal-cotracker}
 * @param req
 * @param res
 * @param next
 */
export function CoTracker(req: Request, res: Response, next: NextFunction) {
  // cocode 획득
  let { cocode, couid } = req.headers;
  if (!validate(cocode, couid)) {
    ({ cocode, couid } = req.query as Record<string, string>);
  }

  // cocode, couid가 정상적이지 않은 경우 실행하지 않는다.
  if (!validate(cocode, couid)) {
    return next();
  }

  // cocode, couid를 이용하여 쿠키 생성
  res.cookie(`_COUID`, `${cocode as string}|${couid as string}`, COOKIE_OPTION);
  return next();
}
