import { RequestHandler } from "express";
/**
 * 스케줄 등록 데코레이터
 * @param middleware
 * @constructor
 */
export declare function Middleware(middleware: RequestHandler | RequestHandler[]): any;
