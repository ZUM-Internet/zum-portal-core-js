import {container, inject} from "tsyringe";
import * as glob from "glob";
import * as path from "path";
import * as yaml_config from 'node-yaml-config';
import {ZumDecoratorType} from "./ZumDecoratorType";
import logger from "../util/Logger";
import {isRegisteredToken} from "../util/TokenCheck";

// Yml파일 컨테이너 토큰명을 가져오는 함수
export const _getYmlToken = (filename) => `${ZumDecoratorType.PREFIX}yml__${filename}`;

/**
 * 리소스 폴더 내의 yml 설정 파일을 객체로 가져오는 데코레이터
 * @param filename 가져올 Yml 파일명
 */
export function Yml(filename: string) {
  try {
    const token = _getYmlToken(filename);

    // @ts-ignore
    if (isRegisteredToken(token)) {
      container.resolve(token);

    } else {
      const files = glob.sync(path.join(process.env.INIT_CWD, process.env.BASE_PATH || '', `./resources/**/${filename}.{yaml,yml}`));
      if (files.length) {
        files.forEach(src => container.register(token, {useValue: yaml_config.load(src)}));
      } else {
        container.register(token, {useValue: ''});
      }
    }

    return inject(token);

  } catch (e) {
    logger.error(`Can not find ${filename}.yml file in resources folder.`);
    return null;
  }
}
