import { join } from 'path';
const yamlConfig = require('node-yaml-config');

let RESOURCE_PATH = join(process.env.INIT_CWD, '../resources');

export function setYmlResourcePath(path: string) {
  RESOURCE_PATH = path;
}

/**
 * YML 파일을 읽어와서 사용하기 위한 설정 함수
 * @param filename
 */
export function ymlConfiguration(filename: string) {
  return () => {
    const yamlPath = join(RESOURCE_PATH, filename);
    return yamlConfig.load(yamlPath) as Record<string, any>;
  };
}
