import { NextFunction, Request, Response } from "express";
/**
 * HTML 캐시를 하지 않게 하기 위해 헤더를 추가하는 미들웨어
 * @param req
 * @param res
 * @param next
 */
export declare function NoCacheHtml(req: Request, res: Response, next: NextFunction): void;
