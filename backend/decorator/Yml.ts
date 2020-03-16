import {container, inject} from "tsyringe";
import * as glob from "glob";
import * as path from "path";
import * as yaml_config from 'node-yaml-config';
import {ZumDecoratorType} from "./ZumDecoratorType";
import logger from "../util/Logger";

// Yml파일 컨테이너 토큰명을 가져오는 함수
export const _getYmlToken = (filename) => `${ZumDecoratorType.PREFIX}yml__${filename}`;

/**
 * 리소스 폴더 내의 yml 설정 파일을 객체로 가져오는 데코레이터
 * @param filename 가져올 Yml 파일명
 */
export function Yml(filename: string) {
  try {
    const token = _getYmlToken(filename);

    try {
      container.resolve(token);

    } catch (e) {
      glob.sync(path.join(process.env.INIT_CWD, `./resources/**/${filename}.{yaml,yml}`))
        .forEach(src => container.register(token, {useValue: yaml_config.load(src)}));
    }
    return inject(token);

  } catch (e) {
    logger.error(`Can not find ${filename}.yml file in resources folder.`);
    return null;
  }
}
