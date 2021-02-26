export declare enum ResourceType {
    FILE = 0,
    JSON = 1
}
/**
 * Resources 폴더 내의 파일 path를 가져오는 함수.
 *
 * @param filename 가져올 디렉토리/파일명
 */
export declare function ResourcePath(filename: string): string;
/**
 * Resources 폴더 내의 파일을 가져오는 함수.
 *
 * @param filename 가져올 디렉토리/파일명
 * @param resourceType 가져올 파일의 리소스 타입 (file: 0, json: 1)
 */
export declare function ResourceLoader(filename: string, resourceType?: ResourceType): any;
