export declare const _getYmlToken: (filename: any) => string;
/**
 * 리소스 폴더 내의 yml 설정 파일을 객체로 가져오는 데코레이터
 * @param filename 가져올 Yml 파일명
 */
export declare function Yml(filename: string): (target: any, propertyKey: string | symbol, parameterIndex: number) => any;
