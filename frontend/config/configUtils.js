const path = require('path');
const merge = require('deepmerge'); // 객체 병합
const rimraf = require('rimraf'); // 쉘 파일 제거 명령 수행 라이브러리

// 노드가 optional chaining을 지원하지 않으므로 기본값을 설정한다.
global.ZUM_OPTION = merge({
  frontSrcPath: path.join(process.env.INIT_CWD, './frontend'),
  resourcePath: path.join(process.env.INIT_CWD, './resources'),
  stubPath: path.join(process.env.INIT_CWD, './resources', './stub')
}, global.ZUM_OPTION || {});

// 프론트엔드 src 폴더 정의
const frontSrcPath = global.ZUM_OPTION.frontSrcPath;
const resourcePath = global.ZUM_OPTION.resourcePath;
const page = require(frontSrcPath + '/vue.page'); // 페이지 리스트

// 웹팩 기본 설정 획득
const getDefaultCliOption = require('./default/_getDefaultCliOption');

module.exports = {

  /**
   * 글로벌 환경변수와 모드별 환경변수를 합치는 함수
   *
   * @param projectConfigurer 프로젝트에서 고유하게 사용되는 설정
   * @returns { {} } Vue Cli3 옵션
   */
  modeConfigurer: function (projectConfigurer) {

    /**
     * 설정을 적용하는 함수
     *
     * @param func 적용할 WebpackChain 함수
     * @param config 적용할 옵션
     */
    const applyChain = (func, config) => func ? func(config) : null;

    // 기본 설정 획득
    const defaultOption = getDefaultCliOption();

    // 줌 모드 환경 변수에 따라 설정 적용
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) { // dev || publish

      if (!process.env.ZUM_FRONT_MODE) {
        throw `ZUM_FRONT_MODE is not defined!\nZUM_FRONT_MODE must be 'dev' or 'publish'`;
      }

      const requiredConfig = require(`./default/${process.env.ZUM_FRONT_MODE}.config.js`);
      return merge.all([defaultOption, projectConfigurer, requiredConfig, {
        chainWebpack: config => {
          applyChain(defaultOption.chainWebpack, config);
          applyChain(requiredConfig.chainWebpack, config);
          applyChain(projectConfigurer.chainWebpack, config);
        }
      }]);


    } else { // build 설정
      return merge.all([defaultOption, projectConfigurer, {

        chainWebpack: config => {
          // 함수 머지가 불가능하므로 직접 webpack chain 함수 실행.
          applyChain(defaultOption.chainWebpack, config);
          applyChain(projectConfigurer.chainWebpack, config);

          // SSR 빌드 모드가 아닐 때 static 폴더 삭제.
          if (process.env.ZUM_FRONT_MODE !== 'ssr') {
            const staticPath = path.join(resourcePath, './static');

            rimraf.sync(`${staticPath}/{css,img,js}`);
            for (let key in page) { // 생성될 파일들 제거
              if (!page.hasOwnProperty(key)) continue;
              rimraf.sync(path.join(resourcePath, `./${page[key].filename}`));
            }
          }

        },

        assetsDir: './static/',
        outputDir: resourcePath,
      }]);
    }


  }

};



