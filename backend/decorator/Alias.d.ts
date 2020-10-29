import InjectionToken from "tsyringe/dist/typings/providers/injection-token";
export declare function Singleton(): (constructor: any) => void;
export declare function Injectable(): (constructor: any) => void;
export declare function Inject(injectionToken: InjectionToken): (target: any, propertyKey: string | symbol, parameterIndex: number) => any;
export declare function Service(): (constructor: any) => void;
export declare function Facade(): (constructor: any) => void;
export declare function Scheduler(): (constructor: any) => void;
