import { join } from 'path';
import * as yamlConfig from 'node-yaml-config';

interface YmalConfig {
  load: (filename: string, env?: string) => Record<string, any>;
}

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
    return (yamlConfig as YmalConfig).load(yamlPath);
  };
}
