import { join } from 'path';
const yamlConfig = require('node-yaml-config');

/**
 * YML 파일을 읽어와서 사용하기 위한 설정 함수
 * @param filename
 */
export function ymlConfiguration (filename: string) {
  const RESOURCE_PATH = join(process.env.INIT_CWD, '../resources');

  return () => {
    const yamlPath = join(RESOURCE_PATH, filename);
    return yamlConfig.load(yamlPath) as Record<string, any>;
  };
}
