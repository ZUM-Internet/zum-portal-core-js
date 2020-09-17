// @ts-ignore
import * as path from "path";
import * as fs from 'fs';

/**
 * Resources 폴더 내의 파일을 가져오는 함수.
 *
 * @param filename 가져올 디렉토리/파일명
 */
export function ResourceLoader(filename: string) {
  try {
    return fs.readFileSync(path.join(process.env.INIT_CWD, './resources', filename));
  } catch (e) {
    throw e;
  }
}


/**
 * Resources 폴더 내의 파일을 가져오는 함수.
 *
 * @param filename 가져올 디렉토리/파일명
 */
export function ResourcePath(filename: string) {
  return path.join(process.env.INIT_CWD, './resources', filename);
}
