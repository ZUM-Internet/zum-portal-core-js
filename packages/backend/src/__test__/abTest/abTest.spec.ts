import { Request, Response } from 'express';
import { putVariantCookies, ABTEST_COOKIE_NAME } from '../../util/abTestUtils';

describe('putVariantCookies', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { cookies: {} };
    res = { cookie: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('전달한 파라미터의 variant 비율대로 쿠키에 테스트 정보를 저장해야 한다', () => {
    const tests = {
      test1: { a: 0.1, b: 0.2, c: 0.3, d: 0.4 },
      test2: { a: 0.9, b: 0.9, c: 0.9 },
    };

    jest.spyOn(Math, 'random').mockReturnValue(0.15);

    putVariantCookies(req as Request, res as Response, tests);

    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.cookie).toHaveBeenLastCalledWith(
      ABTEST_COOKIE_NAME,
      JSON.stringify({ test1: 'b', test2: 'a' }),
      {},
    );

    jest.spyOn(Math, 'random').mockReturnValue(0.55);

    putVariantCookies(req as Request, res as Response, tests);

    expect(res.cookie).toHaveBeenCalledTimes(2);
    expect(res.cookie).toHaveBeenLastCalledWith(
      ABTEST_COOKIE_NAME,
      JSON.stringify({ test1: 'c', test2: 'b' }),
      {},
    );

    jest.spyOn(Math, 'random').mockReturnValue(0.95);

    putVariantCookies(req as Request, res as Response, tests);

    expect(res.cookie).toHaveBeenCalledTimes(3);
    expect(res.cookie).toHaveBeenLastCalledWith(
      ABTEST_COOKIE_NAME,
      JSON.stringify({ test1: 'd', test2: 'c' }),
      {},
    );
  });

  it('기존 쿠키에 이미 존재하는 테스트는 수정하지 않아야 한다', () => {
    req.cookies = {
      [ABTEST_COOKIE_NAME]: JSON.stringify({ alreadyExist: 'wow' }),
    };

    const tests = {
      newTest: { a: 0.1, b: 0.2, c: 0.3, d: 0.4 },
      alreadyExist: { a: 0.9, b: 0.9, c: 0.9 },
    };

    jest.spyOn(Math, 'random').mockReturnValue(0.11);

    putVariantCookies(req as Request, res as Response, tests);

    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.cookie).toHaveBeenLastCalledWith(
      ABTEST_COOKIE_NAME,
      JSON.stringify({ alreadyExist: 'wow', newTest: 'b' }), // 쿠키에 있던 테스트 값은 그대로 유지
      {},
    );
  });
});
