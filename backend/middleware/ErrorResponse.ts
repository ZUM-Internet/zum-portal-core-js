import {NextFunction, Request, Response} from "express";
import logger from "../util/Logger";

/**
 * 특정 URL 접속시 에러를 반환하는 메소드
 * @param req
 * @param res
 * @param next
 */
export default function (req: Request, res: Response, next: NextFunction) {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const {type, message} = req.params;
  const logMessage = `Client ip: ${clientIp}\nLevel: ${type}\nMessage: ${message}`;

  if (type === 'info') {
    logger.info(logMessage);

  } else if (type === 'warn') {
    logger.warn(logMessage);

  } else {
    logger.error(logMessage);
  }

  res.send(logMessage);
}
