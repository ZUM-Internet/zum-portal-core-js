import { NextFunction, Request, Response } from "express";
/**
 * 특정 URL 접속시 컨테이너 이미지 태그 혹은 프로젝트 버전을 반환하는 미들웨어
 * @param req
 * @param res
 * @param next
 */
export default function (req: Request, res: Response, next: NextFunction): void;
