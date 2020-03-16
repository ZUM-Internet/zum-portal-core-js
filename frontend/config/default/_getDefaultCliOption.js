const path = require('path');
const page = require(path.resolve(process.env.INIT_CWD, './frontend') + '/vue.page'); // 페이지 리스트
const webpack = require('webpack');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const getPageConfig = require('./_getPageConfig');


// 프론트엔드 src 폴더
const frontSrcPath = path.resolve(process.env.INIT_CWD, './frontend');
const resourcePath = path.resolve(process.env.INIT_CWD, './resources');

/**
 * CSS 및 ChainWebpack이 설정된 기본 옵션을 가져오는 함수
 *
 * @returns {{}} Vue-CLI3 기본 설정값
 */
module.exports = function getDefaultCliOption() {

  // src/styles의 모든 스타일시트를 import하도록 구분 생성
  const cssImportOption = [`@import "@/styles/index";`];

  return {
    productionSourceMap: false,

    assetsDir: 'static',

    pages: getPageConfig(page), // 멀티 페이지 설정.

    css: { // CSS 설정
      loaderOptions: {
        sass: {
          data: cssImportOption
        }
      },
      extract: !process.env.ZUM_FRONT_MODE,  // 빌드시에만 추출
    },

    chainWebpack: config => {
      // URL 시작 path를 뜻하는 publicPath 획득 처리
      process.env.publicPath = require(path.resolve(process.env.INIT_CWD, './vue.config')).publicPath || '/';
      
      
      config.resolve.alias.set('#', resourcePath);
      config.resolve.alias.set('@', frontSrcPath);
      config.plugins.delete('progress');


      // 타입스크립트 적용
      config.module.rule('ts')
          .use('ts-loader').loader('ts-loader')
          .tap((options) => {
            options.appendTsSuffixTo = [/\.ts\.vue$/];
            options.appendTsxSuffixTo = [/\.tsx\.vue$/];
            options.transpileOnly = true;
            return options;
          });

      // minify 설정
      config.optimization.minimizer([
        new TerserPlugin({
          extractComments: true,
          terserOptions: { ie8: false }
        })
      ]);

      /** SSR 빌드 진행시에만 적용 **/
      if (process.env.ZUM_FRONT_MODE === 'ssr') {
        config.target('node');
        config.optimization.delete('splitChunks');
        config
            .output
            .libraryTarget('commonjs2') // `require` 문법으로 import
            .end()

            .plugins
            .delete('hmr') // hmr 플러그인 제거
            .end()

            .plugin('ssr')
            .use(VueSSRServerPlugin) // ssr 플러그인 적용 (vue-server-bundle.json 파일 생성됨)
            .end();
      }
      /** SSR 빌드 진행시에만 적용 **/

      return config
          .output
          .jsonpFunction('zumPortalJsonp')
          .end()

          .plugin('provide')
          .use(webpack.ProvidePlugin, [{
            Axios: 'axios/dist/axios.min.js',
            FetchJsonp: 'fetch-jsonp/build/fetch-jsonp.js',
            Cookies: 'js-cookie/src/js.cookie.js',
            merge: 'deepmerge/dist/umd.js'
          }]).end()

          .plugin('define')
          .use(webpack.DefinePlugin, [{
            'process.env': JSON.stringify(process.env)
          }]).end();
    },
  };
};
