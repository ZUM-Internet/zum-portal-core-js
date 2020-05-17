import * as winston from "winston";
import {container, singleton} from "tsyringe";

@singleton()
export class LoggerClass {
  public winstonLogger;

  constructor() {
    // ISOString에 타임존을 적용하기 위한 오프셋
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

    // winston logger 생성
    this.winstonLogger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({stack: true}),
        winston.format.printf(info => {
          const infoDate = new Date(info.timestamp);
          return `${new Date(infoDate.getTime() - timezoneOffset).toISOString()} ${info.level} : ${info.message}`;
        })
      ),
      transports: [new winston.transports.Console()]
    });


  }
}

/**
 * 다른 파일에서 사용 가능하게 Logger export
 */
const logger = container.resolve(LoggerClass).winstonLogger;
export default logger;
