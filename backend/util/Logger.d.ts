import * as winston from "winston";
export declare class LoggerClass {
    winstonLogger: winston.Logger;
    constructor();
}
/**
 * 다른 파일에서 사용 가능하게 Logger export
 */
declare const logger: winston.Logger;
export default logger;
