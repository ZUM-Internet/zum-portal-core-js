import { Application, RequestHandler } from "express";
export default abstract class BaseAppContainer {
    app: Application;
    /**
     * Express App 컨테이너
     * @param options 생성 옵션
     * initMiddleWares 라우트 등록 전 설정할 미들웨어
     * dirname 백엔드 폴더
     */
    protected constructor(options?: {
        initMiddleWares?: Array<RequestHandler>;
        dirname?: string;
    });
    /**
     * 에셋 폴더 및 템플릿 엔진 등록
     * @param app app
     * @param dirname 프로젝트 메인 디렉토리
     */
    private templateAndAssets;
}
/**
 * 기본 미들웨어 등록
 */
export declare function attachMiddleWares(app: any): void;
