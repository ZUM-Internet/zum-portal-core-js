import { NextFunction, Request, Response } from "express";
/**
 * 특정 URL 접속시 에러를 반환하는 메소드
 * @param req
 * @param res
 * @param next
 */
export default function (req: Request, res: Response, next: NextFunction): void;
