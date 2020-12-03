"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const tsyringe_1 = require("tsyringe");
let LoggerClass = class LoggerClass {
    constructor() {
        // ISOString에 타임존을 적용하기 위한 오프셋
        const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
        // winston logger 생성
        this.winstonLogger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.printf(info => {
                var _a;
                const infoDate = new Date(info.timestamp);
                return `${(_a = new Date(infoDate.getTime() - timezoneOffset).toISOString()) === null || _a === void 0 ? void 0 : _a.replace(/[a-zA-Z]/g, ' ')} ${info.level} : ${info.message}`;
            })),
            transports: [new winston.transports.Console()]
        });
    }
};
LoggerClass = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [])
], LoggerClass);
exports.LoggerClass = LoggerClass;
/**
 * 다른 파일에서 사용 가능하게 Logger export
 */
const logger = tsyringe_1.container.resolve(LoggerClass).winstonLogger;
exports.default = logger;
//# sourceMappingURL=Logger.js.map