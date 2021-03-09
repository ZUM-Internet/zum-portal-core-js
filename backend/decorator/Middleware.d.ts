import { RequestHandler } from "express";
declare type FunctionHandler = () => RequestHandler;
declare type FunctionHandlerArray = () => RequestHandler[];
/**
 * 미들웨어 등록 데코레이터
 * @param middleware
 * @constructor
 */
export declare function Middleware(middleware: RequestHandler | RequestHandler[] | FunctionHandler | FunctionHandlerArray): any;
export {};
