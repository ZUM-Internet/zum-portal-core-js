import {NextFunction, Request, Response} from "express";

/**
 * HTML 캐시를 하지 않게 하기 위해 헤더를 추가하는 미들웨어
 * @param req
 * @param res
 * @param next
 */
export default function (req: Request, res: Response, next: NextFunction) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  next();
}
