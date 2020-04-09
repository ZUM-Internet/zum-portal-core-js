// @ts-ignore
import * as path from "path";

/**
 * Resources 폴더 내의 파일을 가져오는 함수.
 *
 * @param filename 가져올 디렉토리/파일명
 */
export function ResourceLoader(filename: string) {
  const data = require(path.join(process.env.INIT_CWD, './resources', filename));
  if (!data) {
    throw new Error(`There is an error when getting resources file ${filename}`);
  }
  return data;
}


/**
 * Resources 폴더 내의 파일을 가져오는 함수.
 *
 * @param filename 가져올 디렉토리/파일명
 */
export function ResourcePath(filename: string) {
  const resourcePath = path.join(process.env.INIT_CWD, './resources', filename);
  const data = require(resourcePath);
  if (!data) {
    throw new Error(`There is an error when getting resources file ${filename}`);
  }
  return resourcePath;
}
