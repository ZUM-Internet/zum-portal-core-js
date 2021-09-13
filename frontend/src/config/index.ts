import path from 'path';
import merge from 'deepmerge'; // 객체 병합
import { ProjectOptions } from "@vue/cli-service";
import { sync } from 'rimraf';

import { getZumOptions } from "./options"; // 쉘 파일 제거 명령 수행 라이브러리
import { getDefaultCliOption } from "./default/_getDefaultCliOption"; // 웹팩 기본 설정 획득

// 프론트엔드 src 폴더 정의
const {frontSrcPath, resourcePath, outputPath} = getZumOptions();
const pages: Record<string, { filename: string }> = require(frontSrcPath + '/vue.page'); // 페이지 리스트

/**
 * 글로벌 환경변수와 모드별 환경변수를 합치는 함수
 *
 * @param projectConfigurer 프로젝트에서 고유하게 사용되는 설정
 * @returns { {} } Vue Cli3 옵션
 */
export function modeConfigurer (projectConfigurer: ProjectOptions): ProjectOptions {

  /**
   * 설정을 적용하는 함수
   *
   * @param func 적용할 WebpackChain 함수
   * @param config 적용할 옵션
   */
  const applyChain = (
    func: Function,
    config: ProjectOptions
  ) => func?.(config);

  // 기본 설정 획득
  const defaultOption: ProjectOptions = getDefaultCliOption();

  // 줌 모드 환경 변수에 따라 설정 적용
  const env = process.env.NODE_ENV ?? 'development';
  if (env === 'development') {

    const zumFrontMode = process.env.ZUM_FRONT_MODE ?? 'dev'; // dev or publish
    const requiredConfig = require(`./default/${zumFrontMode}.config.js`);

    return merge.all([defaultOption, requiredConfig, projectConfigurer, {
      // 함수 머지가 불가능하므로 직접 webpack chain 함수 실행.
      chainWebpack (config: ProjectOptions) {
        applyChain(defaultOption.chainWebpack, config);
        applyChain(requiredConfig.chainWebpack, config);
        applyChain(projectConfigurer.chainWebpack, config);
      }
    }]);

  }

  return merge.all([defaultOption, projectConfigurer, {

    assetsDir: './static/',
    outputDir: outputPath,

    chainWebpack (config: ProjectOptions) {
      // 함수 머지가 불가능하므로 직접 webpack chain 함수 실행.
      applyChain(defaultOption.chainWebpack, config);
      applyChain(projectConfigurer.chainWebpack, config);

      // SSR 빌드 모드가 아닐 때 static 폴더 삭제.
      if (process.env.ZUM_FRONT_MODE === 'ssr') return;
      const staticPath = path.join(resourcePath, './static');

      sync(`${staticPath}/{css,img,js}`);
      for (const { filename } of Object.values(pages)) { // 생성될 파일들 제거
        sync(path.join(resourcePath, filename));
      }

    },
  }]);


}