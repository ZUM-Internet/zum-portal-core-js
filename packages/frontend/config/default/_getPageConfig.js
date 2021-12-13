/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { getZumOptions } = require('../options');

const { resourcePath } = getZumOptions();

/**
 * 멀티 페이지 설정 함수.
 *
 * publish 모드에서도 동작하도록 페이지 설정을 오버라이딩한다
 *
 * @param vuePages
 * @returns {*}
 */
module.exports = {
  getPageConfig(vuePages) {
    const { ZUM_FRONT_MODE: mode, NODE_ENV: nodeEnv } = process.env;

    Object.entries(vuePages)
      .filter(([, v]) => v.template)
      .forEach(([key, page]) => {
        page.template = path.join(resourcePath, page.template);

        // SSR 모드인 경우 파일명 세팅 SSR 삽입
        if (mode === 'ssr') {
          page.entry = page.ssrEntry;

          // ssrEntry가 없을 경우, 아예 ssr build에서 제외하기
          if (page.entry === undefined) {
            delete vuePages[key];
          }
          return;
        }

        // 빌드가 아닐땐 filename 제거
        if (nodeEnv !== 'production') {
          delete page.filename;
        }

        if (mode === 'publish') {
          page.template = path.join(resourcePath, page.publishTemplate);
        }
      });

    return vuePages;
  },
};
