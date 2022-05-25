/* eslint-disable @typescript-eslint/no-var-requires */
const { DefinePlugin, ProvidePlugin } = require('webpack');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { getZumOptions, getVuePages } = require('../options');
const { getPageConfig } = require('./_getPageConfig');

/**
 * CSS 및 ChainWebpack이 설정된 기본 옵션을 가져오는 함수
 *
 * @returns {ProjectOptions} Vue-CLI3 기본 설정값
 */
module.exports = () => {
  // 프론트엔드 src 폴더
  const { frontSrcPath, resourcePath, packageJsonPath } = getZumOptions();
  const pages = getVuePages();

  // src/styles의 모든 스타일시트를 import하도록 구분 생성

  return {
    productionSourceMap: false,
    assetsDir: 'static',
    pages: getPageConfig(pages), // 멀티 페이지 설정.
    css: {
      // CSS 설정
      loaderOptions: {
        sass: {
          prependData: `@import "@/styles/index";`,
        },
      },
      extract: !process.env.ZUM_FRONT_MODE, // 빌드시에만 추출
    },

    chainWebpack(config) {
      config.plugins.delete('progress');
      config.resolve.alias.set('#', resourcePath);
      config.resolve.alias.set('@', frontSrcPath);

      // minify 설정
      config.optimization.minimizer('terser').use(
        new TerserPlugin({
          extractComments: true,
          terserOptions: { ie8: false },
        }),
      );

      if (process.env.ZUM_FRONT_MODE === 'ssr') {
        /** SSR 빌드 진행시에만 적용 **/
        config.target('node');
        config.optimization.delete('splitChunks');
        config.output
          .libraryTarget('commonjs2') // `require` 문법으로 import
          .end()

          .plugins.delete('hmr') // hmr 플러그인 제거
          .end()

          .plugin('ssr')
          .use(VueSSRServerPlugin) // ssr 플러그인 적용 (vue-server-bundle.json 파일 생성됨)
          .end();
      } else {
        config
          .plugin('ssr')
          .use(VueSSRClientPlugin) // ssr 플러그인 적용 (vue-client-manifest.json 파일 생성됨)
          .end();
      }

      const { version: APP_VERSION } = require(packageJsonPath);

      return config.output
        .jsonpFunction('zumPortalJsonp')
        .end()
        .plugin('provide')
        .use(ProvidePlugin, [{ Axios: 'axios/dist/axios.min.js' }])
        .end()
        .plugin('define')
        .use(DefinePlugin, [{
          'process.env.API_HOST': JSON.stringify(process.env.API_HOST),
          'process.env.API_PORT': JSON.stringify(process.env.API_PORT),
          'process.env.DEV_HOST': JSON.stringify(process.env.DEV_HOST),
          'process.env.DEV_PORT': JSON.stringify(process.env.DEV_PORT),
          'process.env.HOST': JSON.stringify(process.env.HOST),
          'process.env.INIT_CWD': JSON.stringify(process.env.INIT_CWD),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'process.env.PORT': JSON.stringify(process.env.PORT),
          'process.env.PROXY_PATH': JSON.stringify(process.env.PROXY_PATH),
          'process.env.SSL': JSON.stringify(process.env.SSL),
          'process.env.SSR_PROXY': JSON.stringify(process.env.SSR_PROXY),
          'process.env.VITE_APP_VERSION': JSON.stringify(process.env.VITE_APP_VERSION),
          'process.env.VITE_MODE': JSON.stringify(process.env.VITE_MODE),
          'process.env.VUE_ENV': JSON.stringify(process.env.VUE_ENV),
          'process.env.ZUM_BACK_MODE': JSON.stringify(process.env.ZUM_BACK_MODE),
          'process.env.ZUM_FRONT_MODE': JSON.stringify(process.env.ZUM_FRONT_MODE),
          'process.env.npm_lifecycle_event': JSON.stringify(process.env.npm_lifecycle_event),
          'process.env.npm_package_version': JSON.stringify(process.env.npm_package_version),
          'process.env.publicPath': JSON.stringify(process.env.publicPath),
          'process.env.APP_VERSION': JSON.stringify(APP_VERSION),
        }])
        .end();
    },
  };
};
