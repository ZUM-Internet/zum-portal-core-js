/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const merge = require('deepmerge');
const { sync } = require('rimraf');
const { getVuePages, getZumOptions, setZumOptions } = require('./options'); // 쉘 파일 제거 명령 수행 라이브러리
const getDefaultCliOption = require('./default/_getDefaultCliOption'); // 웹팩 기본 설정 획득

const env = process.env.NODE_ENV ?? 'development';
const zumFrontMode = process.env.ZUM_FRONT_MODE ?? 'dev'; // dev or publish

/**
 * 설정을 적용하는 함수
 *
 * @param func 적용할 WebpackChain 함수
 * @param config 적용할 옵션
 */
const applyChain = (func, config) => func?.(config);

/**
 * 글로벌 환경변수와 모드별 환경변수를 합치는 함수
 *
 * @param projectConfigurer 프로젝트에서 고유하게 사용되는 설정
 * @returns { ProjectOptions } Vue Cli3 옵션
 */
function modeConfigurer(projectConfigurer) {
  // 옵션으로 전달받은 path 세팅
  const { paths } = projectConfigurer;

  delete projectConfigurer.paths;

  if (typeof paths === 'object') setZumOptions(paths);

  // 프론트엔드 src 폴더 정의
  const { resourcePath, outputPath } = getZumOptions();
  const pages = getVuePages();

  // 기본 설정 획득
  const defaultOption = getDefaultCliOption();

  // 줌 모드 환경 변수에 따라 설정 적용
  if (env === 'development') {
    const requiredConfig = require(`./default/${zumFrontMode}.config.js`);

    return merge.all([
      defaultOption,
      requiredConfig,
      projectConfigurer,
      {
        // 함수 머지가 불가능하므로 직접 webpack chain 함수 실행.
        chainWebpack(config) {
          applyChain(defaultOption.chainWebpack, config);
          applyChain(requiredConfig.chainWebpack, config);
          applyChain(projectConfigurer.chainWebpack, config);
        },
      },
    ]);
  }

  return merge.all([
    defaultOption,
    projectConfigurer,
    {
      assetsDir: './static/',
      outputDir: outputPath,

      chainWebpack(config) {
        // 함수 머지가 불가능하므로 직접 webpack chain 함수 실행.
        applyChain(defaultOption.chainWebpack, config);
        applyChain(projectConfigurer.chainWebpack, config);

        // SSR 빌드 모드가 아닐 때 static 폴더 삭제.
        if (zumFrontMode === 'ssr') return;
        const staticPath = path.join(resourcePath, './static');

        sync(`${staticPath}/{css,img,js}`);
        for (const { filename } of Object.values(pages)) {
          // 생성될 파일들 제거
          sync(path.join(resourcePath, filename));
        }
      },
    },
  ]);
}

module.exports = { modeConfigurer };
