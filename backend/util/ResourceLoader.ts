// @ts-ignore
import * as path from "path";
import * as fs from 'fs';


export enum ResourceType {
  FILE,
  JSON
}



/**
 * Resources 폴더 내의 파일을 가져오는 함수.
 *
 * @param filename 가져올 디렉토리/파일명
 * @param resourceType 가져올 파일의 리소스 타입 (file: 0, json: 1)
 */
export function ResourceLoader(filename: string, resourceType: ResourceType = ResourceType.FILE) {
  try {
    const filePath = path.join(process.env.INIT_CWD, './resources', filename);

    if (resourceType == ResourceType.JSON) {
      return require(filePath);
    }

    return fs.readFileSync(filePath);
  } catch (e) {
    throw e;
  }
}


/**
 * Resources 폴더 내의 파일 path를 가져오는 함수.
 *
 * @param filename 가져올 디렉토리/파일명
 */
export function ResourcePath(filename: string) {
  return path.join(process.env.INIT_CWD, './resources', filename);
}
