import { Request, Response } from 'express';
import { CookieOptions } from "express-serve-static-core";
declare type VariantValue = Record<string, number>;
declare type Variant = Record<string, VariantValue>;
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
export declare function putVariantCookies(req: Request, res: Response, variant: Variant, cookieOptions?: CookieOptions): void;
export {};
