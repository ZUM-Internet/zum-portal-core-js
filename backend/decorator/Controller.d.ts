/**
 * 컨트롤러 데코레이터
 * @param ControllerOption 컨트롤러 데코레이터 옵션
 * @constructor
 */
export declare function Controller(ControllerOption?: ControllerOption): (constructor: any) => void;
/**
 * 더 긴 URL부터 핸들링해야 정상 작동하므로 소팅한 후 Express App에 등록한다
 */
export declare function urlInstall(): void;
/**
 * Get 메소드 매핑 데코레이터
 * @param RequestOption 리퀘스트 매핑 옵션
 * @constructor
 */
export declare function GetMapping(RequestOption: RequestOption): (controllerClazz: any, methodName: any, descriptor: any) => any;
/**
 * Post 메소드 매핑 데코레이터
 * @param RequestOption 리퀘스트 매핑 옵션
 * @constructor
 */
export declare function PostMapping(RequestOption: RequestOption): (controllerClazz: any, methodName: any, descriptor: any) => any;
/**
 * Put 메소드 매핑 데코레이터
 * @param RequestOption 리퀘스트 매핑 옵션
 * @constructor
 */
export declare function PutMapping(RequestOption: RequestOption): (controllerClazz: any, methodName: any, descriptor: any) => any;
/**
 * Delete 메소드 매핑 데코레이터
 * @param RequestOption 리퀘스트 매핑 옵션
 * @constructor
 */
export declare function DeleteMapping(RequestOption: RequestOption): (controllerClazz: any, methodName: any, descriptor: any) => any;
/**
 * 컨트롤러 옵션
 */
interface ControllerOption {
    path: string;
}
/**
 * 리퀘스트 옵션
 */
interface RequestOption {
    path: string | Array<string>;
    stub?: object;
}
export {};
