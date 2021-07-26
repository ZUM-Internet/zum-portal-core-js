import { NestExpressApplication } from "@nestjs/platform-express";
export declare abstract class BaseAppContainer {
    /**
     * Express App 컨테이너
     */
    setup(AppModule: any, dirname?: string): Promise<void>;
    abstract listen(app: NestExpressApplication): void;
}
